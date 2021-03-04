
- <img src="https://raw.githubusercontent.com/clecap/sector-coop/main/Documentation/Graphics/Circles/red.png" height="20" width="20"> Feature has made some progress
- <img src="https://raw.githubusercontent.com/clecap/sector-coop/main/Documentation/Graphics/Circles/yellow.png" height="20" width="20"> Feature is partially complete
- <img src="https://raw.githubusercontent.com/clecap/sector-coop/main/Documentation/Graphics/Circles/green.png" height="20" width="20"> Feature has been completed
- <img src="https://raw.githubusercontent.com/clecap/sector-coop/main/Documentation/Graphics/Circles/grey.png" height="20" width="20"> Feature has been scrapped
- <img src="https://raw.githubusercontent.com/clecap/sector-coop/main/Documentation/Graphics/Circles/purple.png" height="20" width="20"> Feature has not been touched upon

Tags:
- #UserClient
- #Blockchain
- #DocumentDB
- #IdentityDB

Feature | Current State | Tags | 🚦
--- | --- | --- | :-:
User can get a unique uuid which he can verify | Public private key pair is part of identity | #Blockchain #UserClient | ![Yellow](/Documentation/Graphics/Circles/yellow.png)
User can publish a document | Database structure exists and smart contract is being developed | #DocumentDB #Blockchain #UserClient |![Green](/Documentation/Graphics/Circles/green.png) 
User can look for papers  | User can check whether a document with a given hash exists | #UserClient #DocumentDB |![Green](/Documentation/Graphics/Circles/green.png)
User can download and read papers | | #UserClient #DocumentDB |![White](/Documentation/Graphics/Circles/purple.png)
User can write a comment for a paper and link it to the paper | | #UserClient #Blockchain #DocumentDB |![White](/Documentation/Graphics/Circles/purple.png)
User can write a review for a paper and link it to the paper and himself  | | #UserClient #Blockchain #DocumentDB |![White](/Documentation/Graphics/Circles/purple.png)
User can upload a new version of a paper and link it to the previous version | | #UserClient #Blockchain #DocumentDB |![White](/Documentation/Graphics/Circles/purple.png)
Papers can be grouped in a Journal | | #DocumentDB #UserClient |![White](/Documentation/Graphics/Circles/purple.png)
Meta data can be attached to a document  | Fields for meta data in database and in the smart contract are open but not used yet| #DocumentDB #UserClient #Blockchain |![Red](/Documentation/Graphics/Circles/red.png)
A user can verify integrity of a document  | Smart Contract will save document hash. Document Server recieves the document and checks if the hash exists in the smart contract independently | #UserClient #Blockchain |![Green](/Documentation/Graphics/Circles/green.png)
Identifier in the system can be linked to ORCID | | #Blockchain #UserClient |![White](/Documentation/Graphics/Circles/purple.png)
Frontend user client for users | Raw html pages exist for very basic interactions, does not incorporate fancy CSS yet. | #UserClient |![Green](/Documentation/Graphics/Circles/green.png)
Blockchain runs in a decentralized P2P network where universities can join and leave any time | | #Blockchain |![White](/Documentation/Graphics/Circles/purple.png)
Document/Identity storage run in a decentralized P2P network where universities can join and leave any time | | #DocumentDB #IdentityDB | ![White](/Documentation/Graphics/Circles/purple.png)
Document search works across a decentralized P2P network  | | #DocumentDB #UserClient |![White](/Documentation/Graphics/Circles/purple.png)
Documents are automatically shared between nodes | | #DocumentDB |![White](/Documentation/Graphics/Circles/purple.png)
User can create a pseudonym | User can get their pseudonymous identity signed by a patron and then added to the smart contract. This initiates the initial token grant from the browser client side (Currently=10) | #Blockchain #UserClient |![Green](/Documentation/Graphics/Circles/green.png)
Blind signature can be used to sign a pseudonym | RSA Blind signatures can be generated on the browser and validated by the smart contract. | #UserClient #Blockchain |![Green](/Documentation/Graphics/Circles/green.png)
DSA based blind signatures are used | No library for validating DSA blind signatures on smart contracts could be found| #Blockchain #UserClient |![Red](/Documentation/Graphics/Circles/red.png)
Pseudonyms are based on EthrDID  | EthrDID was deemed unnecessary for the purpose of the project| #UserClient #Blockchain |![Grey](/Documentation/Graphics/Circles/grey.png)
Pseudonym is uploaded to a private Ethereum chain | Smart contract adds Pseudonyms | #Blockchain #UserClient | ![Green](/Documentation/Graphics/Circles/green.png)
Pseudonym is granted tokens | Smart Contract grants initial tokens to pseudonym(currently=10)| #Blockchain | ![Green](/Documentation/Graphics/Circles/green.png)
User sends document hash to blockchain and pays tokens for it  | Adding document hashs via the Smart Contract is functional| #Blockchain #UserClient |![Green](/Documentation/Graphics/Circles/green.png)
User can link identity to pseudonym on blockchain | This feature is functional on the smart contract as well as the user-client ui | #Blockchain #UserClient | ![Yellow](/Documentation/Graphics/Circles/yellow.png)
User can privately proof ownership of a pseudonym | Smart Contract has the capability to validate signatures however user-client does not implement this yet. | #UserClient #Blockchain |![Yellow](/Documentation/Graphics/Circles/yellow.png)
A central authority can add patrons  | User client allows Central Authority to add Patrons and RSA Public Key| #Blockchain |![Green](/Documentation/Graphics/Circles/green.png)
Central authority can use a UI to add new patrons | | #Blockchain #UserClient | ![Green](/Documentation/Graphics/Circles/green.png)
A patron can add a claim about a user such as "Has Doctor"  | | #Blockchain |![White](/Documentation/Graphics/Circles/purple.png)
Private Ethereum chain does not mine new blocks if there was not recent transaction | The test setup uses a script which preloads some js code that ensures the miner stops after a transaction has been validated by mining a few blocks after it| #Blockchain |![Green](/Documentation/Graphics/Circles/green.png)
Private Ethereum chain has minimal proof of work difficulty | Genesis block starts difficulty at 0 and custom go-ethereum binary increases difficulty per block by only 1 | #Blockchain | ![Green](/Documentation/Graphics/Circles/green.png)
Private Ethereum chain miner accepts 0 gas transactions | Start script for the Ethereum chain tells the miner to accept 0 gas transactions | #Blockchain |![Green](/Documentation/Graphics/Circles/green.png)
Patron keys can be revoked | | #Blockchain #UserClient |![White](/Documentation/Graphics/Circles/purple.png)
User keys can be revoked | | #Blockchain #UserClient | ![White](/Documentation/Graphics/Circles/purple.png)
User sends document to document storage | | #UserClient #DocumentDB| ![Green](/Documentation/Graphics/Circles/green.png)
Document storage uses Self Certifying File System | | #DocumentDB | ![Green](/Documentation/Graphics/Circles/green.png) 
Document storage saves document |  | #DocumentDB | ![Green](/Documentation/Graphics/Circles/green.png) 
Document storage checks on the blockchain for document hash | | #DocumentDB #Blockchain |  ![Green](/Documentation/Graphics/Circles/green.png)
Document storage is searchable | Search by hash only for now | #DocumentDB | ![Yellow](/Documentation/Graphics/Circles/yellow.png)
Document storage has defined data structure |  | #DocumentDB | ![Green](/Documentation/Graphics/Circles/green.png) 
Documents have searchable metadata | Fields for meta data were accounted for but not populated yet| #DocumentDB | ![Red](/Documentation/Graphics/Circles/red.png)
User can create a SecTor account | | #UserClient #IdentityDB | ![Green](/Documentation/Graphics/Circles/green.png) 
User can Login |  | #UserClient #IdentityDB |![Green](/Documentation/Graphics/Circles/green.png) 
User can Logout |  | #UserClient | ![Green](/Documentation/Graphics/Circles/green.png) 
User data can be exported locally  |Unencrypted datablob containing identity data can be imported and exported| #UserClient |![Green](/Documentation/Graphics/Circles/green.png)
User data can be saved in encrypted form to an identity Storage server | Ethereum accounts are encrypted, however RSA public/private keypairs are not | #UserClient #IdentityDB |![Yellow](/Documentation/Graphics/Circles/yellow.png)
User data can be saved in identity Storage server | datablob is stored unencrypted on the identity server | #UserClient #IdentityDB |![Green](/Documentation/Graphics/Circles/green.png)
User can create an identity (keypair)  | User can create a new ethereum address and link this with an identity name of their choice | #UserClient |![Green](/Documentation/Graphics/Circles/green.png)
