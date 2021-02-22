const express = require('express');
app = express();
const {Pool, Client} = require('pg');   // the pool internally delegates queries to clients. Setting those up for every transaction is costly though. Hence, pools.
const { restart } = require('nodemon');
const hash = require('hasha');
let pooldata = require('./secret.json');

app.use(express.json());

const hostname = 'localhost';
const port = 8800;

app.use(function(req, res, next) {
    //allow connections from the user-client-served pages that we expect to deal with.
    res.header("Access-Control-Allow-Origin", "http://localhost:3000"); 
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Headers", "content-type");
    next();
});

// this creates the database connection with the parameters set in secret.json -- alter them accordingly if necessary.
// see https://node-postgres.com/features/connecting for instructions.
const db = new Pool(pooldata);

// make sure the server uses the appropriate schema name.
const schemaName = "documents";
db.query("SET search_path TO '" + schemaName + " ';", (err) => {
    if(err) {
        console.log(err);
    } 
});

app.post('/upload', async(req,res) => {
   console.log("-----------------------------------");
   console.log("Upload process initiated.");

   // hash the document

   var hashedFileName = "";
   
   var file = null;

   // upload the document to the database
   var queryText = "INSERT INTO \""+ schemaName +"\".documents(hash, file) VALUES($1, $2)";
   var values = [hashedFileName, file];

   try {
      db.query(queryText, values, (err, qres) => {
         if(err) {
            res.status(555).send("Document already exists.");
            console.error("A document was tried that already exists.");
         }
         else {
            console.log("Document upload successful");
            res.status(201).send("Upload process was successful.");
            //maybe one wants to write qres to some log file or whatever.
         }
      })
   } catch (err) {
      console.error(err);
      res.status(500).send();
   }
   
});




app.listen(port, () => {
   console.log(`Express.js Document Server running on port: ${port}`);
});