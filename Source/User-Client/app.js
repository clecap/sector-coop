const http = require('http');
const fs = require('fs');
const url = require('url');
const express = require('express');
app = express();
const server = http.createServer(app);
const path = require('path');
const bcrypt = require('bcrypt');
const {Pool, Client} = require('pg');   // the pool internally delegates queries to clients. Setting those up for every transaction is costly though. Hence, pools.
const { restart } = require('nodemon');
const cookie = require('node-cookie');

app.use(express.json());
let pooldata = require('./secret.json');
let cookieSigning = require('./cookies.json');


app.use(function(req, res, next) {
    //allow connections from the user-client-served pages that we expect to deal with.
    res.header("Access-Control-Allow-Origin", "http://localhost:3000"); 
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Headers", "content-type");
    next();
});

const io = require("socket.io")(server); // Socket connections


var roomCodes = {"__inv__":{}}; // keys are patron auth tokens, values are patron's chosen room code

// serving the static html pages
app.use('/', express.static(path.join(__dirname, '/pages')));
app.use('/config', express.static(path.join(__dirname, '/config')));
app.use('/script', express.static(path.join(__dirname, '/scripts')));
const hostname = '127.0.0.1';
const port = 3000;

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




// this creates the database connection with the parameters set in secret.json -- alter them accordingly if necessary.
// see https://node-postgres.com/features/connecting for instructions.
const db = new Pool(pooldata)

// make sure the server uses the appropriate schema name.
const schemaName = "identities";
db.query("SET search_path TO '" + schemaName + " ';", (err) => {
    if(err) {
        console.log(err);
    } 
});


app.post('/login', async(req, res) => {
	console.log('----------------------------------------------------------------------');
	console.log(Date());
	console.log('Login requested for username', req.body.username);
	
    var req_username = req.body.username;
    var req_password = req.body.password;
    let hashed_password;

    var queryText = "SELECT hashed_password FROM \""+ schemaName +"\".users WHERE username = $1;";
    var values = [req_username];

    
    var result = await db.query(queryText, values);

    //if a username is provided that does not exist, the resulting query will have 0 rows.
    //so code execution is aborted at this point
    if(result.rowCount == 0) {
        console.log("User could not be found.");
        return res.status(401).send();
    }

    //if and only if a matching username was found in the database, the code proceeds to compare the passwords.
    hashed_password = result.rows[0].hashed_password;
    console.log("Hashed Password retrieved for user: " + hashed_password);
    
    try {
        if(await bcrypt.compare(req_password, hashed_password)) {
            console.log("Login successful.");

				//For cookies, first, a random value is established.
				var cookieValue = Math.random();
				//The cookie "USER-AUTH" is created, signed ("cookieSigning.key") and encrypted ("true") 
				cookie.create(res, 'USER-AUTH', cookieValue, {/* options */}, cookieSigning.key, true);
            
            res.sendStatus(201);
        } else {
            console.log("Failed compairing " + req_password + " and " + hashed_password);
            res.sendStatus(401);
        }

    } catch (error) {
        console.error("Bcrypt Error: " + error);
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
            var queryText = "INSERT INTO \""+ schemaName +"\".users(username, hashed_password) VALUES($1, $2);"
            var values = [user.username, user.password];
    
            db.query(queryText, values, (err, qres) => {
                //will fail as soon as an attempt to create an existing username is made.
                if(err) {
                    res.status(555).send("User already exists.");
                    console.error("A username was tried that already exists in the database. Rejecting...");
                }
                //other errors should not occur... otherwise distinguish between errors in the block above.
                else {
                    console.log("The registration was succesful."); 
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

server.listen(port, () => {
    console.log(`Express.js http server listening on port: ${port}`);
});
