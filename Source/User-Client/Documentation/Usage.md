# Starting the Server

Run the express.js web server by running `> node app.js`
	
# Using the Features
The User-client pages currently are only tested using the `Chromium`
browser. Firefox currently will not work proerly, since CORS policies
are not properly set for the user-client server.

The following sections require the user to import their data from
file, or from the identity server.

To import from the identity server, make sure you are logged in first
using `http(s)://xxx:3000/public/login.html`. One can register using
`http(s)://xx:3000/public/register.html`. After the login, clicking on
*Click to download Datablob from Identity Server* will load the data
and ethereum wallet into the web-page for usage. Make sure to
additionally add your password in the password field, since this is
necessary to decrypt the ethereum wallet.

The user can also upload a datablob from file by clicking on *Click to
import datablob from file*.

This import must be done before any other operations are initiated.

If you have made any modifations to your data, it is vital to click on
*Click to export datablob to file* or *Click to upload datablob to
identity server* after such operations, otherwise any changes made
will not be accessable on any other page/after a reload/page
redirection.

## Creating an Identity

Using the browser, navigate to
`http(s)://xxx:3000/private/create_identity.html`

This section documents how a user can create ethereum accounts that
they can bind to an identity.

If you do not have any identities, please choose a password and enter
this password into the password field. This password is used to
encrypt and store the ethereum accounts.

It is also planned that this password can also be used to encrypt all
the user's data using a password to key scheme such as aargon2,
however this feature is not yet implemented.

**Please remember this password**

1. Enter your existing password/new password in the password field.
2. If you would like to import existing identities, you can do so by
   selecting a file, and clicking on *Click to import datablob from
   file*. ***WARNING: This operation may overwrite any new identities
   created without exporting after***
3. Enter any unique name that represents the identity you are
   creating.
4. Click on *Click to create ethereum account* to create a new
   identity.  If no errors occur, an alert box with a success message
   should show you your new ethereum account address. You can create
   as many identites as you like. You will also be able to see all the
   identities and their respective ethereum addresses below the
   button.
5. Export your updated data using *Click to export datablob to file*
6. If this idenity is meant to be a patron, please keep note of the
   ethereum address associated with it displayed below.

## Generate RSA Keypair for Identity

Using the browser, navigate to
`http(s)://xxx:3000/private/generate_rsa.html`

This section documents how a user can generate an rsa keypair and
associate this keypair to an existing identity.

1. Import your datablob.
2. Enter the existing identity name for which you would like to
   generate a new RSA Keypair.
3. Click on *Generate RSA Key*.
4. In a few seconds, an RSA Key should be created, and it's public
   key, encoded as a pkcs1-pem string will be provided in the text
   field.
5. Keep note of this Public Key and provide this, along with the
   ethereum address generated using the previous section, to the *CA*,
   so they can add your identity as a Patron.
6. Export your updated data.

## Make Identity a Patron

Using the browser, navigate to
`http(s)://xxx:3000/private/generate_rsa.html`

This section documents how a user can add an identity to the SecTor
smart contract as a Patron.



This function is limited to the *CA*.
1. Create a `json` file, such as `ca.json` on your filesystem with the
   following contents:
   ```javascript
   {"ethereum" :
	   {
	   "keystoreArray":[<ca_keystore>],
	   "walletAccounts":{"<ca account name>":"<ca_address>"}
	   },
	   "bs" : {}
   }
   ```

   Here, `ca_keystore` and `ca_address` are the content of the
   keystore file associated with the *CA*, and the address associated
   with this ethereum account. `ca account name` can be any
   identifiable string used to identify this account. This information
   should have been saved while following the instructions in the
   [Test Chain Installation Guide](../../../Documentation/Documents/Test%20Chain%20Setup%20Guide.md).

   Following is an example `json` file which gives an idea as to what
   this file should look like:
   
   ```javascript
   
   {"ethereum" :
	   {
	   "keystoreArray":[{"version":3,"id":"ca685b25-d8c8-4a41-8fe0-228bd710b566","address":"7b5fb9a5535f2976cdc99c57d19111b2ed3cb925","crypto":{"ciphertext":"f8098d27a5759e97fb30371e7a066cf3673db400ebd61f39d622a309fda293ae","cipherparams":{"iv":"b8ed9a456b099a74f0ab1a920ab4875f"},"cipher":"aes-128-ctr","kdf":"scrypt","kdfparams":{"dklen":32,"salt":"50bc999daa71af24124642f46d374c0dc2ece5da275eadd1b9fa7e2378cbdebb","n":8192,"r":8,"p":1},"mac":"4d79b198a17337833f9df21e2de4d07ba13856b977ffa53f3727f277a9b8c230"}}],
	   "walletAccounts":{"ca_account":"7b5fb9a5535f2976cdc99c57d19111b2ed3cb925"}
	   },
   "bs" : {}
   }
   ```

2. Import this json file in the browser page using the password used
   when creating the *CA* account.
3. Enter the identity name that represents the *CA's* account
4. Enter their RSA public key encoded in a pkcs1-pem string into the
5  textarea.
6. Enter the ethereum address provided by the identity, which is to be
   made a patron.
7. Click on *Create Patron*.
8. If no error's occur, a transaction receipt will be printed below,
   indicating success in patron creation.


## Blindly Sign Pseudonym's identity address with generated RSA key

Using the browser, navigate to
`http(s)://xxx:3000/private/patron.html`

This section documents how a user can Blindly Sign a Pseudonym address.

1. Import your datablob
2. Enter the identity name associated with a Patron account. This
   patron account must exist in the datablob, and in addition, must
   have generated an RSA keypair and been added to the SecTor Smart
   Contract by the *CA*.
3. Click on *Generate RoomKey and wait for Pseudonym*. This will load
   the RSA keypair from the imported datablob, and generate a room
   key, which is displayed and automatically copied on the clipboard.
4. This room code must be shared with the entity, whose Pseudonymous
   identity the Patron wishes to sign blindly.
5. Once the Pseudonym connects to the user using this room code, the
   Pseudonym's address will be signed blindly and transmitted
   automatically. No further interaction is required.
6. The user must not navigate away from this page until the
   Pseudonym send a signing request.
## Request Patron for Signature and add Identity as Pseudonym
	
Using the browser, navigate to
`http(s)://xxx:3000/private/create_pseudonym.html`

This section documents how a user can ask a Patron to Blindly Sign
their identity and add this identity to the SecTor smart contract as a
pseudonym.

1. Import your datablob.
2. Enter the room code provided by a patron.
3. Click on *Connect to Patron and Send Blind Signature Request*.
4. This will initiate the Blind Signature process.

Please check the log below for more details on the progress.
The browser client will automatically request for tokens as well.

## Upload a Document by Spending Tokens

Using the browser, navigate to 
`http(s)://xxx:3000/private/upload.html`

This section documents how a user can upload a document to the
document server, after spending tokens on the smart contract.

1. Import your datablob
2. Enter the Identity Name that has the tokens necessary to upload the
   document.
3. Choose a document that you would like to upload using the *Choose
   File* button.
4. Finally, click on *Click to Upload Document* to initiate the process.

Subsequently, the user-client will attempt to spend tokens on the
smart contract, and then attempt to upload the document to the
document server.

Refer the the log below for updates.

Once the process is complete, the user is shown the uploaded
document's hash. This can be saved for using in the next section

## Search for a Document using a hash

This section allows the user to confirm that a document has been
uploaded to the document server.

Using the browser, navigate to 
`http(s)://xxx:3000/public/search.html`

Enter the Document Hash in the text box and click on *Search*.

