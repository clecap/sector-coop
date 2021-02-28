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

let identityDbPoolData = require('./identitySecret.json');
let documentDbPoolData = require('./documentSecret.json');
// this creates the database connection with the parameters set in ***secret.json -- alter them accordingly if necessary.
// see https://node-postgres.com/features/connecting for instructions.
const identityDatabase = new Pool(identityDbPoolData)
const documentDatabase = new Pool(documentDbPoolData)

let cookieSigning = require('./cookies.json');
var cookieJar = [];

// the file name under which each uploaded file is temporarily stored before self-certifying measures are taken.
const temporaryFileName = "last.pdf"
const fsPath = "../Database/Uploaded_Documents"
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, fsPath);
    },

    filename: function(req, file, cb) {
        cb(null, temporaryFileName);
    }
});

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
    
    var Cookie = Cookie.get(req, 'USER-AUTH', cookieSigning.key, true);
    if (Cookie) {
        console.log('Cookie retrieved from request: ', Cookie);
        if (cookieJar.includes(Cookie)) {
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

app.post('/upload-document', async(req,res) => {
    console.log("Upload requested.");

    let upload = multer({storage: storage}).single('uploaded-file');
    
    upload(req, res, function(err) {
        // req.file contains information of uploaded file
        // req.body contains information of text fields, if there were any
        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        else if (!req.file) {
            return res.send('Please select file to upload');
        }
        else if (err instanceof multer.MulterError) {
            return res.send(err);
        }
        else if (err) {
            return res.send(err);
        }

        /* 
        Perform steps to make sure document is self-certifying:
            1. compute the hash of the uploaded file
            2. check the database for existing hash
                2.1 if the hash already exists, abort. The document won't be saved.
                2.2 else insert the hash into the database
            3. rename the file according to its hash.
        */
        var success = tryMakeSelfCertifying();
        if (success == true) {
            console.log("Upload performed successfully.");
            return res.sendStatus(201);
        } else {
            console.log("Upload was not performed successfully.");
            return res.sendStatus(507)
        }
    })
})
//#endregion

//#region Helper Functions

function tryMakeSelfCertifying() {
    /* 
        Perform steps to make sure document is self-certifying:
            1. compute the hash of the uploaded file
            2. check the database for existing hash
                2.1 if the hash already exists, delete the document and abort
                2.2 else insert the hash into the database
            3. 
    */

    // compute the hash of the uploaded file
    var hash = hasha.fromFileSync(fsPath+"/"+temporaryFileName, {algorithm: 'sha256'});

    // check the database for existing hash
    var queryText = "INSERT INTO \"documents\".hashes(sha256_hash) VALUES ($1);"
    var values = [hash];
    
    documentDatabase.query(queryText, values, (err, qres) => {
        //will fail as soon as an attempt to create an existing document is made because of the primary key constraint.
        if(err) {
            console.error("Database error:", err);
            /* fs.unlink(fsPath+"/"+temporaryFileName, function (err) {
                if(err) {
                    console.error("Error deleting the file:", err);
                }
                else {
                    console.log("File was deleted.");
                }
            }) */
            return false;
        }
        // else the hash was iserted successfully.
    })
    
    // if the code reaches this part, then rename the file according to its hash.
    fs.rename(fsPath+"/"+temporaryFileName, fsPath+"/"+hash+".pdf", function(err) {
        if (err) {
            console.error("File was not renamed." + err)
            return false;
        }
    });

    return true;
}

//#endregion

server.listen(port, () => {
    console.log(`Express.js http server listening on port: ${port}`);
});
