const express = require('express');
app = express();
const bcrypt = require('bcrypt');
var bodyParser = require('body-parser');

app.use(express.json());

const hostname = '127.0.0.1';
const port = 6000;

//this needs to be replaced by a database connection in the future!!
var user = [];

app.post('/login', async(req, res) => {
    const user = users.find(user => user.username === req.body.username)
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
    req = bodyParser.json(req);
    console.log("Registration initiated with " + req.body.username);
    try {
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        console.log("Password is now: " + hashedPassword);
        const user = {username: req.body.username, password: hashedPassword}
        users.push(user)
        res.status(201).send()
    } catch {
        res.status(500)
    }
})

app.listen(port);
