# BackEnd Installation 

## PostgreSQL Installation

If you don't have postgresql installed follow this link to download `https://www.postgresql.org/download/`. 

## PostgreSQL Configuration
Setup Database, Database User, password and Host with this credentials 
``
        HOST: localhost,
        database: postgres,
        user:     postgres,
        password: postgres
``. 

If you are having problem with the setup you can follow the instruction on this link `https://www.javatpoint.com/install-postgresql` , `https://www.javatpoint.com/postgresql-create-database`


## Knex Installation

Run 
`npm install knex -g
 npm install knex --save
 npm install pg --save
` 
NB: if this command was properly executed , then is you run `Knex` on this terminal at this point, you should get a response showing list of knex commands, if not try installing again.

## Build

``
cd pgconfig and Run `npm install`.
cd .. (ie the root of back-end)
Run `npm install`

``

## Database Migration
At the root of back-end, 
Run `Knex migrate:latest`.

## Starting Back-end Server
At the root of back-end, 
Run `node server.js` or `nodemon server`.

## final

Your server should be running on port 5000 right now.
