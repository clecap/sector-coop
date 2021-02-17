const express = require('express');
app = express();
const bcrypt = require('bcrypt');
const {Pool, Client} = require('pg');
const { restart } = require('nodemon');

app.use(express.json());

const hostname = 'localhost';
const port = 8000;

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000"); //allow connections from the user client server
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Headers", "content-type");
    next();
});

// replace this later with the appropriate parameters set during the database setup.
// alternatively, set the parameters before starting the app via the command line.
// see https://node-postgres.com/features/connecting for instructions.
const db = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'identities',
    password: '4xmtaNNE.X?z/15m<ep)#jU>Qnb81:',
    port: 5432,
})

// make sure the server uses the appropriate schema name.
const schemaName = "identities";
db.query("SET search_path TO '" + schemaName + " ';", (err) => {
    if(err) {
        console.log(err);
    } 
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
    console.log("---------------------------------------------------------");
    console.log("Registration initiated with username: " + req.body.username);

    try {
        var salt = await bcrypt.genSalt()
        var hashedPassword = await bcrypt.hash(req.body.password, salt)
        //console.log("Password is now: " + hashedPassword);
        var user = {username: req.body.username, password: hashedPassword};

        try {
            var queryText = "INSERT INTO \"identities\".users(username, hashed_password) VALUES($1, $2)"
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
                }
            });
            
        } catch (err) {
            console.error(err);
            res.status(500).send();
        }
    } catch (err){
        console.error(err);
        res.status(500).send();
    }
})

app.listen(port, () => {
    console.log(`Express.js Identity Server running on port: ${port}`);
});
