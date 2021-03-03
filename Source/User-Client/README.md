# Table of Contents
1. Links to installation, usage and copyright notices for the user client server application
2. API documentation
3. Some notes on how to contribute

# Links
* [ Installation ](Documentation/Installation.md)
* [ Usage ](Documentation/Usage.md)
* [ Copyright Notices ](Documentation/Copyright.md)

# API
Where no type is specified, all requests shall be made using stringified JSON with the keys named in the Request column to ensure the program will behave as expected.
For example: the `/login` route expects the following stringified JSON object as payload of the POST request:
```
var payload = JSON.stringify(
   {
      "username" : "the-user's-username",
      "password" : "the-user's-password"
   }
);
```
The list of all implemented routes currently includes:

Route | Method | Request Body | Response Codes | Cookie read | Cookie set 
--- | --- | --- | --- | --- | ---
/login | POST | username, password | 200, 401 | | on successful authentification: USER-AUTH 
/requireLogin | GET | | 200, 401 | USER-AUTH | 
/register | POST | username, password | 201, 500 (probable database error), 555 (user already exists) | | USER-AUTH
/logout | GET | | 200, 500 | USER-AUTH | clears: USER-AUTH
/upload-document | POST | document (pdf file) | 201, 401 (user is not logged in), 500, 507 (document already exists) | USER-AUTH | 
/search-document | POST | hash | 204 (the document exists), 404 | | 
/upload-datablob | POST | datablob (here, no further data is intended, hence the datablob should *be* the request body) | 201, 401, 500 | USER-AUTH | |
/download-datablob | GET | | 200, 401, 404, 500 | USER-AUTH

# Current state and How to contribute
Currently, most features listed in the API above are tested and stable. However, they are very minimalistic.
* **Searching for a document** at the moment neither retrieves the document, nor serves it to the user. It only checks whether a document should exist according to its hash in the database.  
* **Registration**: Right now, upon registration, the user is only asked for a username and a password. No email or other personal details are required. It should be considered to extend the registration process. Perhaps some publishers *want* to be recognized.
* Right now there is **no way to reset a password**. It is debatable whether this is a desired feature at all since it requires some manner of contacting the user via email for example. 
* If further information is collected, the database needs upgrading accordingly.
* **Uploading a document** at the moment accepts no document metadata such as author (if desired).
* At the moment the server does not check whether an uploaded document really *is* a pdf file. It is however, always saved as a pdf file. Some additional checks to ensure system security might be required.
