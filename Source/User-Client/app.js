const http = require('http');
const fs = require('fs');
const url = require('url');
const express = require('express');
app = express();
const server = http.createServer(app);
const path = require('path');

const io = require("socket.io")(server); // Socket connections


var roomCodes = {"__inv__":{}}; // keys are patron auth tokens, values are patron's chosen room code

// serving the static html pages
app.use('/', express.static(path.join(__dirname, '/pages')));

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
	    let patronToken = socket.handshake.auth.token;
	    let patronPubKey = socket.handshake.auth.publicKey;
	    roomCodes[patronToken] = roomCode;
	    roomCodes[ "__inv__" ][roomCode] = {
		patronToken: patronToken,
		patronPubKey: patronPubKey
	    };
	    
	    console.log(roomCodes);
	    socket.join(roomCode);
	    socket.on('disconnect', (reason) => {
		console.log("Patron:" + patronToken + " disconnected. Reason: " + reason);
		socket.leave(roomCode);
		delete roomCodes[patronToken];
		delete roomCodes[ "__inv__" ][roomCode];
	    });
	    
	    socket.on('signingResponse', (blindSignature) => { // Patron responds with a blindSignature
		io.to(roomCode).emit('psuedonymSigningResponse', blindSignature);
	    });
	}
	else { //PSUEDONYM STUFF
	    let roomCode = socket.handshake.auth.roomCode;
	    let psuedonymToken = socket.handshake.auth.token;
	    
	    socket.join(roomCode);
	    console.log(socket.rooms);
	    console.log("Sending Patron's public key to Psuedonym");
	    io.to(roomCode).emit('patronPubKey', roomCodes[ "__inv__" ][roomCode].patronPubKey); //Send the psuedonym the patron's public key
	    socket.on('disconnect', (reason) => {
		console.log("Psuedonym:" + psuedonymToken + " disconnected. Reason: " + reason);
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


/*const server = http.createServer((req, res) => {
    var q = url.parse(req.url, true);
    var filename = "." + q.pathname;
    fs.readFile(filename, function(err, data) {
        //potentially exposes entire file system, check for that maybe.
        if(err) {
            res.writeHead(404, {'Content-Type' : 'text/html'});
            return res.end("404 not found");
        }
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
    });    
}).listen(port);
*/

server.listen(port, () => {
    console.log(`Express.js http server listening on port: ${port}`);
});
