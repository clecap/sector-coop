### API UserClient calling IdentityStorage

1. `create-SecTOR-account(username, SHA256(password), encr(AES256Key, key: password), datablob);` => returns `{"success": boolean, "errors":[]}`

2. `login-SecTOR-account(username, SHA256(password));` => returns `{"success": boolean, "errors":[], sessionKey:""}`

3. `read-data(sessionKey);` => returns `{datablob:"..", "success": boolean, "errors":[]}`

4. `read-enc-AES256Key(sessionKey)` => returns `{encrAEX256Key:"..", "success": boolean, "errors":[]}`

5. `read-all-data(sessionKey);` => returns `{datablob:"...", encrAESK256key:"..." "success": boolean, "errors":[]}`

6. `update-data(sessionKey, datablob);` => returns `{"success": boolean, "errors":[]}`

7. `update-AES256Key(sessionKey, encr(AES256Key, password))` => returns `{"success": boolean, "errors":[]}`

8. `update-password(sessionKey, SHA256(old-password), SHA256(new-password), datablob);` => returns `{"success": boolean, "errors": []}`

9. `delete-SecTOR-account(sessionKey, SHA256(password));` => returns `{"success": boolean, "errors":[]}`

10. `logout-SecTOR-account(sessionKey);` => returns `{"success": boolean, "errors":[]}`

### API UserClient calling Document Storage

1. `upload-document(document, metadata, transaction-hash);` => returns `{"success": boolean, "errors":[], document-hash}`

2. `query-document-status(SHA256(document));` => returns `{"status": "STATUS_CODE", "success": boolean, "errors":[]}`
    STATUS_CODE | Description
    ---| ---
    RJCT | Document has been rejected since hash does not exist on blockchain
    VRFD  | Document hash has been verified to exist on the blockchain
    TRSC   | Document Acceptance transaction has been sent to Blockchain
    SUCC    |Document Acceptance transaction has been confirmed by the Blockchain
    DOCN  |Document not found (Documen't)
    
    (Temporary Status codes)
3. `query-document-metadata(SHA256(document));` => `{"success:" boolean, "errors": [], metadata:json}`

Metadata should contain number of linked reviews, comments and their hashes so one can look for new reviews for ones document.

Search functions go here!

### API UserClient calling Blockchain
 ~ later

### API DocumentStorage calling Blockchain

This should use a js library to either call a smart contract or propose/check transactions.
1. `check-for-document-transaction(transactionHash);`
2. `create-acceptance-transaction(...);` 
