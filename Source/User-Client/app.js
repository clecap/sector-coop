//#region Essential Server Setup and DB Connections
const http = require('http');
const fs = require('fs');
const express = require('express');
app = express();
const server = http.createServer(app);
const path = require('path');
const bcrypt = require('bcrypt');
const {Pool, Client} = require('pg');   // the pool internally delegates queries to clients. Setting those up for every transaction is costly though. Hence, pools.
const { restart } = require('nodemon');
const Cookie = require('node-cookie');
const multer = require('multer');
const hasha = require('hasha');
const Web3 = require('web3');

app.use(express.json());

// path on the file system where documents will be uploaded
const fsPath = "../Database/Uploaded_Documents/"

let identityDbPoolData = require('./identitySecret.json');
let documentDbPoolData = require('./documentSecret.json');
let userclient_config = require('./config/deploy/userclient.json');
let sector_contract_config = require('./config/contract/SecTor.json');
// this creates the database connection with the parameters set in ***secret.json -- alter them accordingly if necessary.
// see https://node-postgres.com/features/connecting for instructions.
const identityDatabase = new Pool(identityDbPoolData)
const documentDatabase = new Pool(documentDbPoolData)

let cookieSigning = require('./cookies.json');
const { async } = require('hasha');
var cookieJar = [];


app.use(function(req, res, next) {
    //allow connections that we expect to deal with.
    res.header("Access-Control-Allow-Origin", "http://localhost:3000"); 
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Headers", "content-type");
    next();
});



//#endregion

//#region Sockets
const io = require("socket.io")(server); // Socket connections


var roomCodes = {"__inv__":{}}; // keys are patron auth tokens, values are patron's chosen room code

// serving the static html pages
app.use('/', express.static(path.join(__dirname, '/pages')));
app.use('/config', express.static(path.join(__dirname, '/config')));
app.use('/script', express.static(path.join(__dirname, '/scripts')));
const hostname = '127.0.0.1';
const port = 3000;
// Websocket implementation for BlindSignatures 
io.on('connection', (socket) => {
    console.log("A socket has been connected");
    // Assume client sockets send auth tokens of the form:
    // {role:"psuedonym"/"patron",
    // token:"someauthtokenassignedafterlogin",
    // roomCode:"a unique room code chosen by a patron"
    // publicKey: "patron's publicKey" (only required if role is patron)}
    if (socket.handshake.auth.token!="" && ["psuedonym", "patron"].indexOf( socket.handshake.auth.role )>=0) {// Replace this with some token authentication
	if (socket.handshake.auth.role=="patron"){
	    console.log("Patron stuff"); //PATRON
	    let roomCode = socket.handshake.auth.roomCode;
	    let patronID = socket.id;
	    let patronPubKey = socket.handshake.auth.publicKey;
	    let patronEthereum_address = socket.handshake.auth.ethereum_address;
	    roomCodes[patronID] = roomCode;
	    roomCodes[ "__inv__" ][roomCode] = {
		patronID: patronID,
		patronPubKey: patronPubKey,
		patronEthereum_address: patronEthereum_address
	    };
	    
	    console.log(roomCodes);
	    socket.join(roomCode);
	    socket.on('disconnect', (reason) => {
		console.log("Patron:" + patronID + " disconnected. Reason: " + reason);
		socket.leave(roomCode);
		delete roomCodes[patronID];
		delete roomCodes[ "__inv__" ][roomCode];
	    });
	    
	    socket.on('signingResponse', (blindSignature) => { // Patron responds with a blindSignature
		io.to(roomCode).emit('psuedonymSigningResponse', blindSignature);
	    });
	}
	else { //PSUEDONYM STUFF
	    let roomCode = socket.handshake.auth.roomCode;
	    let psuedonymID = socket.id;
	    
	    socket.join(roomCode);
	    console.log(socket.rooms);
	    console.log("Sending Patron's public key to Psuedonym");
	    io.to(roomCode).emit('patronPubKey', roomCodes[ "__inv__" ][roomCode].patronPubKey, roomCodes[ "__inv__" ][roomCode].patronEthereum_address); //Send the psuedonym the patron's public key
	    socket.on('disconnect', (reason) => {
		console.log("Psuedonym:" + psuedonymID + " disconnected. Reason: " + reason);
		socket.leave(roomCode);
	    });
	    
	    socket.on("signingRequest", (blindedHash) => { // Psuedonym requests a signature from patron
		io.to(roomCode).emit("psuedonymSigningRequest", blindedHash);
	    });
	    
	}
    }
    else{
	socket.disconnect(); // Socket client was invalid
    }
});

//#endregion

//#region User Client Routing
app.post('/login', async(req, res) => {
	console.log('----------------------------------------------------------------------');
	console.log(Date());
	console.log('Login requested for username', req.body.username);
	
    var req_username = req.body.username;
    var req_password = req.body.password;
    let hashed_password;

    var queryText = "SELECT hashed_password FROM \"identities\".users WHERE username = $1;";
    var values = [req_username];

    
    var result = await identityDatabase.query(queryText, values);

    //if a username is provided that does not exist, the resulting query will have 0 rows.
    //so code execution is aborted at this point
    if(result.rowCount == 0) {
        console.log("User could not be found.");
        return res.status(401).send("The user could not be found in the database.");
    }

    //if and only if a matching username was found in the database, the code proceeds to compare the passwords.
    hashed_password = result.rows[0].hashed_password;
    
    try {
        var success = await bcrypt.compare(req_password, hashed_password);
        if(success) {
            console.log("Login successful.");

				//For cookie values, the username and a random string are established, separated by ":"
                var cookieValue = req_username + ":" + Math.random().toString();

                //This cookieValue is stored in the array of all currently active cookies.
                cookieJar.push(cookieValue);

				//The cookie "USER-AUTH" is created, signed ("cookieSigning.key") and encrypted ("true") 
				Cookie.create(res, 'USER-AUTH', cookieValue, {/* options */}, cookieSigning.key, true);
            
            res.sendStatus(200);
        } else {
            console.log("Failed compairing " + req_password + " and " + hashed_password);
            return res.status(401).send("The password entered does not match the password in the database.");
        }

    } catch (error) {
        console.error("Bcrypt Error: " + error);
    }
})

app.get('/requireLogin', async(req,res) => {
    console.log('----------------------------------------------------------------------');
	console.log(Date());
    console.log('Private page accessed. Checking for valid login cookie.');
    
    var cookie = Cookie.get(req, 'USER-AUTH', cookieSigning.key, true);
    if (isValid(cookie)) {
        return res.status(200).send("The cookie was successfully verified.");
    } else {
        return res.status(401).send("The USER-AUTH cookie could not be verified on the server. It is either invalid or unbeknownst to the server. Perhaps the server was restarted recently?");
    }
})

app.post('/register', async(req,res) => {
    console.log("---------------------------------------------------------");
    console.log("Registration initiated with username: " + req.body.username);

    try {
        var salt = await bcrypt.genSalt()
        var hashedPassword = await bcrypt.hash(req.body.password, salt)
        //console.log("Password is now: " + hashedPassword);
        var user = {username: req.body.username, password: hashedPassword};

        try {
            // adding "schemaName" here, probably should be redundant, but better be safe than sorry.
            var queryText = "INSERT INTO \"identities\".users(username, hashed_password) VALUES($1, $2);"
            var values = [user.username, user.password];
    
            identityDatabase.query(queryText, values, (err, qres) => {
                //will fail as soon as an attempt to create an existing username is made.
                if(err) {
                    console.error("A username was tried that already exists in the database. Rejecting...");
                    return res.status(555).send("User already exists.");
                }
                //other errors should not occur... otherwise distinguish between errors in the block above.
                else {
                    console.log("The registration was succesful."); 

                    //For cookie values, the username and a random string are established, separated by ":"
                    var cookieValue = user.username + ":" + Math.random().toString();

                    //This cookieValue is stored in the array of all currently active cookies.
                    cookieJar.push(cookieValue);

				    //The cookie "USER-AUTH" is created, signed ("cookieSigning.key") and encrypted ("true") 
				    Cookie.create(res, 'USER-AUTH', cookieValue, {/* options */}, cookieSigning.key, true);

                    return res.status(201).send('Registration process complete');
                    //maybe one wants to write qres to some log file or whatever. this can be done here.
                }
            });


    // if the code gets to this part, SOMETHING went wrong.        
        } catch (err) {
            console.error(err);
            return res.status(500).send("The user database returned an unhandled error. Please check the server log for details.");
        }
    } catch (err){
        console.error(err);
        return res.status(500).send("There was an error with password encryption. Please check the server log for details.");
    }
})

app.get('/logout', async(req,res) => {
    console.log('----------------------------------------------------------------------');
	console.log(Date());
    console.log('Logout requested.');

    // if possible, deletes the cookie from the user's browser, depending on which browser they use.
    // else set the expiry date of the cookie to the past
    Cookie.clear(res, 'USER-AUTH');

    // also delete the cookie from cookieJar
    var cookie = Cookie.get(req, 'USER-AUTH', cookieSigning.key, true);
    if(cookie) {
        // find the cookie in the cookie jar
        var index = cookieJar.indexOf(cookie);

        // and delete it without leaving "undefined" holes in the array.
        cookieJar.splice(index, 1);
        
        // check if this really worked
        if(!cookieJar.includes(cookie)) {
            console.log('Logout was performed successfully.')
            return res.status(200).send("Logout performed successfully.");
        } else {
            // otherwise inform the user that something bad had happened.
            console.log('The logout could not be performed successfully: the cookie jar still contains the user\'s login cookie. The user was informed.');
            return res.status(500).send("An error occurred on the server while trying to invalidate your current login cookie. Please delete it manually to ensure a future login is not possible with this cookie.");
        }
    } else {
        console.log('The logout could not be performed successfully: an unidentified error occurred. The user was informed.');
        return res.status(500).send("An error occurred on the server. Please delete the cookie manually to ensure a future login is not possible with this cookie.");
    }
})

app.post('/upload-document', multer({storage: multer.memoryStorage()}).single('uploaded-file'), async (req,res) => {
    /* 
        This writes the uploaded document to a memory buffer first before saving it on disk.
        Beware that this might cause memory issues with EXTREMELY large files.
        When writing to disk directly, the program would crash as soon as more than ~100 kB are uploaded because
        there is no way to "wait" for an upload to finish using multer.
        This was a problem because the function tryMakeSelfCertifying() relies on an upload to be finished.
    */
    console.log('----------------------------------------------------------------------');
	console.log(Date());
    console.log("Upload requested.");

    var cookie = Cookie.get(req, 'USER-AUTH', cookieSigning.key, true);
    if (!isValid(cookie)) {
        return res.status(401).send("We could not verify your identification cookie. Please try logging in again to fix this issue.");
    }
    checkDocHashOnBlockchain(req.file.buffer, (doccheck, hash) => {
	if (doccheck == false) {
	    return res.status(500).send("Document Hash not found on SecTor Contract");
	}
	var hash2 = (async()=> await tryMakeSelfCertifying(req.file.buffer) )();
	if (hash2) {
            // NOW save the file to disk
            try{
		fs.writeFileSync(fsPath + hash + ".pdf" , req.file.buffer);  
            } catch (err) {
		console.error(console.error(err));
		return res.status(500).send("An error occurred while saving the file on the server.");
            }
	    
            console.log("Upload performed successfully. Hash " + hash + " was inserted into the database.");
            return res.status(201).send("Document successfully uploaded with hash " + hash);
	} else {
            console.log("Upload was not performed successfully.");
            return res.status(507).send("The document upload did not perform successfully because this document already exists. Please note that renaming the file will not fix this.");
	}
	
    });
})

app.post('/search-document', async(req, res) => {
    var hash = req.body.hash;
    var queryText = "SELECT sha256_hash FROM \"documents\".hashes WHERE sha256_hash = $1";
    var values = [hash]

    var result = await documentDatabase.query(queryText, values);

    if(result.rowCount == 0) {
        // given hash was not found
        console.log("Hash " + hash + " was not found in the database.");
        return res.status(404).send("A document that matches the given hash could not be found in the database.");
    } 
    // else the document exists. add code to serve the document below.
    console.log("Hash " + hash + " exists.");
    return res.status(204).send("A document that matches the given hash was found.");
})

app.post('/upload-datablob', async(req, res) => {
    /* 
        accepts (stringified) JSON object
        with req.body === datablob
    */

    // identify the user the datablob belongs to
    var cookie = Cookie.get(req, 'USER-AUTH', cookieSigning.key, true);
    if (!isValid(cookie)) {
        return res.status(401).send("We could not verify your identification cookie. Please try logging in again to fix this issue.");
    }

    // (else): the cookie is valid and we can proceed:

    var username = cookie.toString().split(":", 1)[0]; // remember: cookie is like "username:randomNumber". should be a string already but one can never be too sure.
    console.log(username);
    var datablob = JSON.stringify(req.body);
    console.log(req);
    // check the database whether the user has already uploaded data:
    var queryText = "SELECT * FROM \"identities\".datablobs WHERE username = $1;";
    var values = [username];

    var result = await identityDatabase.query(queryText, values);
    
    // if they have, than the query will have a nonzero row count (i.e.: 1)
    if(result.rowCount != 0) {
        // update the existing datablob
        try {
            await updateDatablob(username, datablob);
        } catch (err) {
            console.error(err);
            return res.status(500).send("The datablob could not be updated in the database.");
        }
        return res.status(201).send("The datablob was successfully updated in the database.");
    }
    else {
        // create a new one
        try {
            await insertNewDatablob(username, datablob);
        } catch (err) {
            console.error(err);
            return res.status(500).send("The datablob could not be saved into the database.");
        }
        return res.status(201).send("The datablob was successfully inserted into the database.");
    }
    
    return res.status(500).send("Something went wrong with the database. Check the server log for further info.");
})

app.get('/download-datablob', async(req,res) => {
    // identify the user that wants to retrieve the datablob
    var cookie = Cookie.get(req, 'USER-AUTH', cookieSigning.key, true);
    if (!isValid(cookie)) {
        return res.status(401).send("We could not verify your identification cookie. Please try logging in again to fix this issue.");
    }
    // (else): the cookie is valid and we can proceed:

    var username = cookie.toString().split(":", 1)[0]; // remember: cookie is like "username:randomNumber". should be a string already but one can never be too sure.

    var queryText = "SELECT datablob FROM \"identities\".datablobs WHERE username = $1;"
    var values = [username]

    try {
        var result = await identityDatabase.query(queryText, values)
    } catch(err) {
        console.error(err);
        return res.status(500).send("Something went wrong with the database. Check the server log for further info.");
    }

    if (result.rowCount == 0) {
        // this user has no datablob in the database
        console.log("For user " + username + ", no datablob was found in the database");
        return res.status(404).send("For the given username, no datablob was found in the database.");
    }
    // else...
    var  datablob = result.rows[0].datablob;
    return res.status(200).send(datablob);
})

//#endregion

//#region Helper Functions

function isValid(cookie) {
    if (cookie) {
        console.log('Cookie retrieved from request: ', cookie);
        if (cookieJar.includes(cookie)) {
            // a valid cookie that the server recognizes, exists.
            return true;
        } else {
            // the cookie is not known to the server. A (new) login is required
            console.log('The cookie could not be verified to be a valid, current login cookie.');
            return false;
        }
    } else {
       // No cookie is present whatsoever, OR cookie integrity could not be verified (it is signed and encrypted after all...)
       console.log("No cookie was retrieved from the request.");
       return false;
    }
}
async function checkDocHashOnBlockchain(file, cb){

    //Check if document's hash exists on the blockchain
    var hash = hasha(file, {algorithm:'sha256'});
    try{  
	web3 = new Web3(userclient_config.ethereum.providerAddress);
	sector_contract = new web3.eth.Contract(sector_contract_config.abi,
						userclient_config.ethereum.contractAddress);
	sector_contract.methods.getDocument("0x".concat( hash )).call().then((doc) => {
	    console.log(doc);
	    console.log(hash);
	    cb(doc[0].isValue, hash);
	});
    }    
    catch(error){
	console.log(error);
	cb(false, undefined);
    }
}
async function tryMakeSelfCertifying(upload) {
    /* 
        Perform steps to make sure document is self-certifying:
            1. compute the hash of the uploaded file
            2. check the database for existing hash
                2.1 if the hash already exists, reject the request.
                2.2 else insert the hash into the database
            3. 
    */

    // compute the hash of the uploaded file
    var hash = hasha(upload, {algorithm: 'sha256'});

    // check the database for existing hash
    var queryText = "INSERT INTO \"documents\".hashes(sha256_hash) VALUES ($1);"
    var values = [hash];
    
    try {
        await documentDatabase.query(queryText, values);
    } catch (error) {
        console.error("The database responded with an error, probably because the document with hash " + hash + " already exists.");
        return false;
    }

    return hash;
}

async function updateDatablob(username, datablob) {
    // updates existing (username, datablob) pair in the database
    // returns a boolean indicating success

    var queryText = "UPDATE \"identities\".datablobs SET datablob = $2 WHERE username = $1;"
    var values = [username, datablob];

    try{
        await identityDatabase.query(queryText, values);
    } catch (err) {
        console.error(err);
        return false;
    }
    return true;
} 

async function insertNewDatablob(username, datablob) {
    // inserts a new (username, datablob) pair into the database
    // returning a boolean indicating success

    var queryText = "INSERT INTO \"identities\".datablobs VALUES ($1, $2);"
    var values = [username, datablob];

    try{
        await identityDatabase.query(queryText, values);
    } catch (err) {
        console.error(err);
        return false;
    }
    return true;
}

//#endregion

server.listen(port, () => {
    console.log(`Express.js http server listening on port: ${port}`);
});
