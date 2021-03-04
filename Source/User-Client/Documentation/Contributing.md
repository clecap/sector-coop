This Document explains how developers can contribute to the userclient
and extend the application.

# Smart Contract Interactions

When the smart contract code is modified/migrated again, please make
sure to change the abi in
[SecTor.json](../config/contract/SecTor.json). This file is loaded by
the browser as well as the node.js server to interact with the smart
contract.

Also, update the contractAddress in `config/deploy/userclient.json`.



# Node server

The file [app.js](../app.js) contains the server code for the node.js
express webserver. This server acts as the Identity Server, Document
Server and also serves the browser pages for the user-client and
fascilitates Patron-Pseudonym interaction using a WebSocket
implementation using socket.io.


# RSA Blind Signatures

The file [rsablind-node.js](../scripts/rsablind-node.js) imports the
RSA blind signature library and also the npm Node-RSA library for
generation of RSA keypairs.

These libaries are loaded into the DOM by creating an object,
`window.myexports`. This file must be 'browserified', as mentioned in
the [Installation Guide](Installation.md) to be used in the
browser. When changes are made to the blind signature implementation,
or more imports are added, the browserification must be repeated.

Please refer to the [Copyright Notice](Copyright.md) to see the
changes made in the blind signature libary. 

# Userclient API

The file [userclient.js](../scripts/api/userclient.js) handles api
functions for the userclient.

This file is loaded into all browser html pages where:
1. Ethereum addresses need to be created
2. User Data needs to be uploaded/downloaded from
   file/identity server.
3. Automatic Decryption and encryption of the ethereum wallet of the
   user is needed.
4. Interaction with the SecTor Smart Contract is required.

This file, when loaded onto the browser page, will automatically load
the configuration files: `/config/contract/SecTor.json`,
`/config/deploy/userclient.json`.

Once the `userclient.json` file is downloaded, the user-client
automatically connects to the ethereum web3 provider that is specified
in the configuration, and also creates a smartcontract object.

```javascript
var userclient = {config:undefined,
		  web3:undefined};
var sectorApi = {config:undefined,
		 smartContract:undefined,
		 functions:{}};
var identityServerApi = {config:undefined,
			 functions:{}};
var documentServerApi = {config:undefined};


identityServerApi.datablob = {"ethereum" :
			      {
				  "keystoreArray":[],
				  "walletAccounts":{}
			      },
			      "bs" : {}
			     };
```

This file maintains the following important global variables:

1. identityServer.datablob : The user's loaded datablob, which
   defaults to an empty datablob. This global variable is changed when
   it is imported using the import/export functions.
2. userclient.web3 : Ethereum web3 instance that is defined when a
   connection to the ethereum web provider is established.
3. sectorApi.smartContract : [ web3 Contract object ](https://web3js.readthedocs.io/en/v1.3.4/web3-eth-contract.html#web3-eth-contract).

### Calling a smart contract method

For this to work, please make sure that the `userclient.web3` and
`sectorApi.smartContract` objects were loaded.


The function `sectorApi.functions.interact` can be used to interact
with the smart contract.

Example: `addDocumentHash`
```javascript
methodObject = sectorApi.smartContract.addDocumentHash("<some hash beginning with 0x>");
sectorApi.functions.interact(methodObject, {from:"<pseudonym_address>"}, call=false, callback=console.log);
```

The `call` parameter is used to specify whether the interaction simply
"call's" the smart contract, or send a transaction. Please refer to
the [ web3.js documentation ](https://web3js.readthedocs.io/en/v1.3.4/web3-eth-contract.html#methods-mymethod-call)
for more information. 

The function adds a fixed amount of gas (1000000). Not adding this
option often results in a failure.

The callback function will be called with either a receipt of a
transaction if `call=false`, or the result of the function call
otherwise.

### Button Event Handlers


The file also assumes that some buttons/input fields exist in the html
page for some functions to work.

`["#datablob-upload-button", "#datablob-download-button",
"#datablob-button", "#datablob-export-button"]` are the buttons for
which event listeners are defined to implement the functionality.
