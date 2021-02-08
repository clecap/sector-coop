Components:
- SecTor Acc on Identity Storage (handled by UserClient and Identity Storage)
- SecTor Acc on UserClient (handled by UserClient)
- EthrDID (handled by UserClient, University and Blockchain, Identity Storage only sees this as encrypted data blob)
- Document (handled by UserClient, Document Storage)
- Document Hash (handled by UserClient, Blockchain)
- Token (Handled by UserClient, Blockchain and Identity Storage only sees this as encrypted data blob)

---

SecTor Acc on Identity Storage:
- a name (used uniquely to find a user account)
- a hashed password (only user knows the real one, used to unlock an account and allows downloading all data related to it)
- encrypted data blob (base64 encrypted json, not readable by the Identity Storage in any way, only decrypted by the UserClient)
- AES256 key encrypted using a password (which optionally can be the same as the user password)

Sector Acc on UserClient:
- a name
- actual password
- plain AES256 key
- json user data

Sector Acc on UserClient json user data:
```
{

Identity: {
    "paillier-keypair": "...",
}
Pseudonyms: [
    {
      "ethr-addr": "...",
      "ethr-keypair" : { ... },
      "DID Document" : { 
      //optional
          "first-name": "...",
          "last-name": "...",
          "university": "...",
          "contact": {
              "email": "...",
              "phone": "...",
              ...
          }

      },
      "Tokens" : [
        {
          "UUID" : "...",
          "spent": boolean, // boolean indicating whether the token was spent
          "spent-transaction" : "..." //Transaction Hash where the token was spent
          ..
          ..
        },
        ..
        ..
      ],
      "Documents" : [
      {
        "document-hash": "SHA256",
        "tokens-used": ["UUID1", "UUID2", .. ],
        "timestamp-uploaded": "ISO_8601 format",
        "timestamp-accepted": "ISO_8601 format",
        "type": "...", // Paper | Review | Comment | ...
        "version": "...", // Version number of document
        //Only for Review, Comment
        "link": "SHA256", //hash of parent document
      },
      ],
      
    },
    ..
    ..
 ]

}
```

EthrDID:
- depends on library implementation, not tested yet but only needed for communication between UserClient and Blockchain

Document:
- Document hash
- Document itself (for example pdf)
- intial metadata as json (Title, keywords, abstract, authors, ...)

Document Hash:
- Sha256 hash of the document and its initial meta data

Token:
- see Section Acc on UserClient json user data, Tokens section
