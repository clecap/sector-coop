# Pre-requisites
1. `nodejs`
2. `npm`
3. postgres stuff...
# Dependencies

In the `User Client` directory, run `npm install`. This will
install the javascript libraries required to run the User-Client

Run `> browserify scripts/rsablind-node.js -o scripts/rsablind-bundle.js`.

This allows for the blind-signatures library to be used in the browser.
# Configuration 
**IMPORTANT STEP**
	
The User-client needs to be configured to be able to connect to:
1. Ethereum web3 Provider
2. Postgres Database

## Ethereum web3 Provider

Copy the json configuration template file
[../config/defaults/userclient.json](../config/defaults/userclient.json)
into the `deploy` directory [../config/deploy/](../config/deploy/) in
a json file under the same name.

Change the values of the properties `providerAddress` and
`contractAddress` to the URL of the geth ethereum provider and HEX
address of the SecTor smart contract deployed on the ethereum chain.

Please refer to documentation for setting up the geth provider and
smart contract [here](../../../Documentation/Documents/Test Chain Setup
Guide.md)
