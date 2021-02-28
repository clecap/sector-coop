# Starting the Server

Run the express.js web server by running `> node app.js`
	
# Using the Features

In all of the following sections, please enter your password, select
the file required for importing your datablob, and click on *Click to
import datablob from file*. 

This import must be done before any other operations are completed.

If you have made any modifations to your data, it is vital to click on
*Click to export datablob to file* after such operations, otherwise
any changes made will not be accessable on any other page/after a
reload/page redirection.

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
   [Test Chain Installation Guide](../../../Documentation/Test%20Change%20Installation%20Guide.md).

   Following is an example `json` file which gives an idea as to what
   this file should look like:
   
   ```javascript
   
   {"ethereum" :
	   {
	   "keystoreArray":[{"version":3,"id":"0d35e06d-db96-4ccb-87ff-2983323bd5b7","address":"308da72f4a4f37a18ae6c5eb1d5bf79e8265dcc8","crypto":{"ciphertext":"78d88e63969552eb80c2062b9a21ef1aaf4e2bea8572b112424661b962ae744b","cipherparams":{"iv":"1999a35a0feda93ff75e056377320443"},"cipher":"aes-128-ctr","kdf":"scrypt","kdfparams":{"dklen":32,"salt":"c57a8b50bb21b5aae7ee7f85b785a406737d3863bfdae7e226a65a03388a3ebb","n":8192,"r":8,"p":1},"mac":"6a4a248005caa279c4d473ab7dac88e65c02fea3a36421f11c160708d76c3bb3"}}],
	   "walletAccounts":{"my_ca_account":"308da72f4a4f37a18ae6c5eb1d5bf79e8265dcc8"}
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
`http(s)://xxx:3000/private/create_identity.html`

This section documents how a user can ask a Patron to Blindly Sign
their identity and add this identity to the SecTor smart contract as a
pseudonym.

1. Import your datablob.
2. Enter the room code provided by a patron.
3. Click on *Connect to Patron and Send Blind Signature Request*.
4. This will initiate the Blind Signature process.

Please check the log below for more details on the progress.
