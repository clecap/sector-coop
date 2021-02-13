var express = require('express');
app = express();
var bcrypt = require('bcrypt');

app.use(express.json());

var hostname = 'localhost';
var port = 8000;

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Headers", "content-type");
    next();
});

//this needs to be replaced by a database connection in the future!!
var users = [];

app.post('/login', async(req, res) => {
    console.log('Login requested.');
    var user = users.find(user => user.username === req.body.username);
    if(user == null) {
        return res.status(400).send('Cannot find user')
    }
    try {
       if(await bcrypt.compare(req.body.password, user.password)) {
           res.status(201).send('Login successful')
       }
       else {
           res.status(202).send('Login failed');
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
        console.log("Pushing user: " + user.username);
        users.push(user)
        res.status(201).send('Registration process complete');
    } catch {
        res.status(500)
    }
})

app.listen(port, () => {
    console.log(`Express.js Identity Server running on port: ${port}`);
});
