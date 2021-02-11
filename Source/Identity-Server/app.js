var express = require('express');
app = express();
var bcrypt = require('bcrypt');

app.use(express.json());

var hostname = '127.0.0.1';
var port = 6000;

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
})

//this needs to be replaced by a database connection in the future!!
var user = [];

app.post('/login', async(req, res) => {
    var user = users.find(user => user.username === req.body.username)
    if(user == null) {
        return res.status(400).send('Cannot find user')
    }
    try {
       if(await bcrypt.compare(req.body.password, user.password)) {
           res.send('Login successful')
       }
       else {
           res.send('Login failed')
       }
    } catch {
        res.status(500)
    }
})

app.post('/register', async(req,res) => {

    console.log("Registration initiated with " + req.body.username);
    try {
        var salt = await bcrypt.genSalt()
        var hashedPassword = await bcrypt.hash(req.body.password, salt)
        console.log("Password is now: " + hashedPassword);
        var user = {username: req.body.username, password: hashedPassword}
        users.push(user)
        res.status(201).send()
    } catch {
        res.status(500)
    }
})

app.listen(port);
