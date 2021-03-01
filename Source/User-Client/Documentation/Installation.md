# Pre-requisites
1. `nodejs`
2. `npm`
3. postgreSQL. The code has been tested on PostgreSQL 13. The optional software pgAdmin is highly recommended to easily view database statistics.
   
# Dependencies

In the `User Client` directory, run `npm install`. This will
install the javascript libraries required to run the User-Client

Run `browserify scripts/rsablind-node.js -o scripts/rsablind-bundle.js`.

This allows for the blind-signatures library to be used in the browser.

All dependencies include:
Library | Purpose
--- | ---
http | basic running of the http webserver
fs | accessing the file system
express | simplifying the dealing with http requests
path | resolving file system paths
bcrypt | dealing with password en- and decryption
pg | connecting to the postgres databases and performing queries
nodemon | development library to automatically restart the application upon change. *Can be deleted*.
node-cookie | simplifying dealing with cookies
multer | dealing with document uploads to the server
hasha | hashing files when uploaded to the server

# Configuration 
**IMPORTANT STEP**
	
The User-client needs to be configured to be able to connect to
1. Ethereum web3 Provider
2. Postgres Database

as well as signing and en-/decrypting cookies.

## Ethereum web3 Provider

Copy the json configuration template file
[../config/defaults/userclient.json](../config/defaults/userclient.json)
into the `deploy` directory [../config/deploy/](../config/deploy/) in
a json file under the same name.

Change the values of the properties `providerAddress` and
`contractAddress` to the URL of the geth ethereum provider and HEX
address of the SecTor smart contract deployed on the ethereum chain.

Please refer to documentation for setting up the geth provider and
smart contract [here](../../../Documentation/Documents/Test%20Chain%20Setup%20Guide.md)

## Postgres Database

Set up two separate databases, "identities" and "documents" in postgres. Do not forget the passwords and other parameters set during database setup, as they will become important very soon. During development, `postgres`, the standard database superuser was used, but it might be a good idea to incorporate a nonprivilieged user that the user client application will act as.

### Setting up the database(s)

In order for the application to work out of the box, the following SQL queries will create the databases in a manner that the application will be able to deal with.

Alternatively, two schemas in the same database could be used, the application is flexible enough to deal with that. If it is decided that a single database is the better approach, alter the `identities` name of the database to one of your liking.

```
CREATE DATABASE identities
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    CONNECTION LIMIT = -1;
```
Then, when connected to the database:
```
CREATE SCHEMA identities
   AUTHORIZATION postgres;

CREATE TABLE identities.users
(
    username character varying(64) COLLATE pg_catalog."default" NOT NULL,
    hashed_password character(60) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (username)
)

TABLESPACE pg_default;

ALTER TABLE identities.users
    OWNER to postgres;
```

Now that the idenitity database is set up, it is time to create the document database. Right now this will contain nothing more than the SHA256 hash of the documents that are uploaded to the system. This, at this point in time, makes sure that duplicates of documents can be recognized and rejected easily. In the future, the database could include document metadata in (presumably) different tables.

```
CREATE DATABASE documents
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'German_Germany.1252'
    LC_CTYPE = 'German_Germany.1252'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;
```
And then again, when connected to the database:
```
CREATE SCHEMA documents
    AUTHORIZATION postgres;

CREATE TABLE documents.hashes
(
    sha256_hash character(64) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT hashes_pkey PRIMARY KEY (sha256_hash)
)

TABLESPACE pg_default;

ALTER TABLE documents.hashes
    OWNER to postgres;
```

### Connecting the server application to the database(s)
The server application requires by default two documents in the same directory as `app.js` itself: `identitySecret.json` and `documentSecret.json`. These two should contain the appropriate parameters set up during the postgres / Database setups and look like this:
```
{
   "user": "postgres",
   "host": "localhost",
   "database": "database-name",
   "password": "the-database's-password",
   "port": "5432"
}
```
* `user`: the user that the application should be. As mentioned, during the development, the superuser `postgres` was used.
* `host`: the IP address of the database server, not the user client application. This will remain `localhost` presumably.
* `database`: the name of the database. If the exact queries above have been used and the databases are separate, then `documentSecret.json` will have `documents` and `identitySecret.json` will have `identities` to be put here.
* `password` should contain the password for either database.
* `port` is the port that the postgres server runs on, `5432` by default. Again, not the port of the user client server application.

## Cookie validation
The application is set up to use cookies for user authentification to access private pages after they logged in. To provide an additional layer of security, the cookies are signed and encrypted before being sent to the user. This requires a key set in `cookies.json` in the application folder. The content should look like this:
```
{
   "key": "keyValue"
}
```
* `key`: The value of the key that is being used for the cookie validation.