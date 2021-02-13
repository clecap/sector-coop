This guide will provide instructions on how to set up the different servers.

## Prerequisites for all servers
Since all servers are written as Node-js applications, having Node installed on the system is necessary. It can be obtained [here](https://nodejs.org/en/). It is strongly encouraged to include the Node Package Manager (npm) during the installation.

At the time of writing, directly including the required node modules in the application directory has been decided against in favour of global installations. This way, the additional step "Linking the modules" is required for each server.

## Development dependencies
During the development process, using the package `nodemon` is encouraged as it automatically restarts the server application as soon as any change to a file within its working directory is saved. Using the npm, simply installing it via `npm install -g nodemon` on bash and then invoking `nodemon app.js` in the directory where app.js exists, will make developing a lot easier. Alternatively, an absolute path can be used, of course, as well.

## Setting up the identity server
The server requires the following modules:
- [express](https://expressjs.com/)
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js/)

Install them as follows. If it is wished to not install global packages, omit the `-g` parameter and skip the linking.
```
npm install -g express bcrypt
```
Link them to the app:
```
npm link express bcrypt
```
Then simply start the app as usual:
```
node app.js
```