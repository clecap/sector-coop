# Installation
`npm install`
# Running the Express Server
`node app.js`
# Features
## Blind Signature Signing
Currently is a Work in Progress, so it's just a demo
1. Open `http://localhost:3000/private/patron.html` in a browser
2. Click on 'yes' when prompted.
3. Wait for the message 'Generation completed. Establishing socket
   with server, waiting for psuedonym'.
4. Open `http://localhost:3000/private/psuedonym.html` in another browser tab/window
5. Click on 'yes' when prompted.

Following this please check the browser console of both tabs.  The
psuedonym should be able to receive and verify the blindly signed
message from the Patron.

The Psuedonym will then attempt to call the addPsuedonym method on the
smart contract. This functionality is currently not working and under
active development.
