const express = require('express');
app = express();
const bcrypt = require('bcrypt');
const {Pool, Client} = require('pg');   // the pool internally delegates queries to clients. Setting those up for every transaction is costly though. Hence, pools.
const { restart } = require('nodemon');
let pooldata = require('./secret.json');

app.use(express.json());

const hostname = 'localhost';
const port = 8000;

app.use(function(req, res, next) {
    //allow connections from the user-client-served pages that we expect to deal with.
    res.header("Access-Control-Allow-Origin", "http://localhost:3000"); 
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Headers", "content-type");
    next();
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




//this needs to be replaced by a database connection in the future!!
var users = [];


app.post('/login', async(req, res) => {
    console.log('Login requested.');

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

            // establish and send a session cookie here!

            res.status(200).send();
        } else {
            console.log("Failed compairing " + req_password + " and " + hashed_password);
            res.status(401).send();
        }

    } catch (error) {
        console.error("Bcrypt Error: " + error);
    }

    

    /* if(user == null) {
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
    } */
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

app.listen(port, () => {
    console.log(`Express.js Identity Server running on port: ${port}`);
});
