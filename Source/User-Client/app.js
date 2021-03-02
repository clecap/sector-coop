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

app.use(express.json());

// path on the file system where documents will be uploaded
const fsPath = "../Database/Uploaded_Documents/"

let identityDbPoolData = require('./identitySecret.json');
let documentDbPoolData = require('./documentSecret.json');
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
        return res.status(401).send();
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
            
            res.sendStatus(201);
        } else {
            console.log("Failed compairing " + req_password + " and " + hashed_password);
            res.sendStatus(401);
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
    if (cookie) {
        console.log('Cookie retrieved from request: ', cookie);
        if (cookieJar.includes(cookie)) {
            // a valid cookie that the server recognizes, exists.
            res.sendStatus(200);
        } else {
            // the cookie is not known to the server. A (new) login is required
            console.log('The cookie could not be verified to be a valid, current login cookie.');
            res.sendStatus(401);
        }
    } else {
       // No cookie is present whatsoever, OR cookie integrity could not be verified (it is signed and encrypted after all...)
       console.log("No cookie was retrieved from the request.");
       res.sendStatus(401); 
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
                    res.status(555).send("User already exists.");
                    console.error("A username was tried that already exists in the database. Rejecting...");
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

                    res.status(201).send('Registration process complete');
                    //maybe one wants to write qres to some log file or whatever. this can be done here.
                }
            });


    // if the code gets to this part, SOMETHING went wrong.        
        } catch (err) {
            console.error(err);
            res.status(500).send();
        }
    } catch (err){
        console.error(err);
        res.status(500).send();
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
            res.sendStatus(200);
        } else {
            // otherwise inform the user that something bad had happened.
            console.log('The logout could not be performed successfully: the cookie jar still contains the user\'s login cookie. The user was informed.');
            res.sendStatus(500);
        }
    } else {
        console.log('The logout could not be performed successfully: an unidentified error occurred. The user was informed.');
        res.sendStatus(500);
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

    
    var hash = await tryMakeSelfCertifying(req.file.buffer);
    if (hash) {
        // NOW save the file to disk
        try{
            fs.writeFileSync(fsPath + hash + ".pdf" , req.file.buffer);  
        } catch (err) {
            console.error(console.error(err));
            req.sendStatus(500);
        }

        console.log("Upload performed successfully. Hash " + hash + " was inserted into the database.");
        return res.status(201).send("Document successfully uploaded with hash " + hash);
    } else {
        console.log("Upload was not performed successfully.");
        return res.status(507).send("The document upload did not perform successfully because this document already exists.");
    }
})

app.post('/search-document', async(req, res) => {
    var hash = req.body.hash;
    var queryText = "SELECT sha256_hash FROM \"documents\".hashes WHERE sha256_hash = $1";
    var values = [hash]

    var result = await documentDatabase.query(queryText, values);

    if(result.rowCount == 0) {
        // given hash was not found
        console.log("Hash " + hash + " was not found in the database.");
        res.sendStatus(404);
    } 
    // else the document exists. add code to serve the document below.
    console.log("Hash " + hash + " exists.");
    res.sendStatus(204);
})
//#endregion

//#region Helper Functions

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

//#endregion

server.listen(port, () => {
    console.log(`Express.js http server listening on port: ${port}`);
});
