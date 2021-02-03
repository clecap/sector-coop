const http = require('http');
const fs = require('fs');
const url = require('url');
const express = require('express');
app = express();
const path = require('path');



app.use('/', express.static(path.join(__dirname, '/pages')));


const hostname = '127.0.0.1';
const port = 3000;


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

app.listen(port);
