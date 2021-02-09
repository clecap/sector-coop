
- <img src="https://raw.githubusercontent.com/clecap/sector-coop/main/identity-group/Circles/red.png" height="20" width="20"> Feature has made some progress
- <img src="https://raw.githubusercontent.com/clecap/sector-coop/main/identity-group/Circles/yellow.png" height="20" width="20"> Feature is partially complete
- <img src="https://raw.githubusercontent.com/clecap/sector-coop/main/identity-group/Circles/green.png" height="20" width="20"> Feature has been completed
- <img src="https://raw.githubusercontent.com/clecap/sector-coop/main/identity-group/Circles/grey.png" height="20" width="20"> Feature has been scrapped
- <img src="https://raw.githubusercontent.com/clecap/sector-coop/main/identity-group/Circles/white.png" height="20" width="20"> Feature has not been touched upon

Feature | Current State | Notes | 🚦
--- | --- | --- | :-:
**Project specifications** | - | - | -
User can get a unique uuid which he can verify | Public private key pair is part of identity | | ![Yellow](/identity-group/Circles/yellow.png)
User can publish a document | Database structure exists and smart contract is being developed | |![Yellow](/identity-group/Circles/yellow.png)
User can look for papers  | Search via direct document hash is being built| |![Red](/identity-group/Circles/red.png)
User can download and read papers  | | |![White](/identity-group/Circles/white.png)
User can write a comment for a paper and link it to the paper | | |![White](/identity-group/Circles/white.png)
User can write a review for a paper and link it to the paper and himself  | | |![White](/identity-group/Circles/white.png)
User can upload a new version of a paper and link it to the previous version | | |![White](/identity-group/Circles/white.png)
Papers can be grouped in a Journal | | |![White](/identity-group/Circles/white.png)
Meta data can be attached to a document  | Fields for meta data in database and in the smart contract are open but not used yet| |![Red](/identity-group/Circles/red.png)
A user can verify integrity of a document  | Smart Contract will save document hash but is still in development| |![Yellow](/identity-group/Circles/yellow.png)
Identifier in the system can be linked to ORCID | | |![White](/identity-group/Circles/white.png)
Frontend user client for users | | |![Red](/identity-group/Circles/red.png)
Blockchain runs in a decentralized P2P network where universities can join and leave any time | | |![White](/identity-group/Circles/white.png)
Document/Identity storage run in a decentralized P2P network where universities can join and leave any time | | | ![White](/identity-group/Circles/white.png)
Document search works across a decentralized P2P network  | | |![White](/identity-group/Circles/white.png)
Documents are automatically shared between nodes | | |![White](/identity-group/Circles/white.png)
**Identity Group** | - | - | -
User can create a pseudonym | Smart contract with this feature is being developed| |![Yellow](/identity-group/Circles/yellow.png)
Blind signature can be used to sign a pseudonym | RSA Blind signatures work outside of smart contract, smart contract integration is being developed| |![Yellow](/identity-group/Circles/yellow.png)
DSA based blind signatures are used | No library for validating blind signatures on smart contracts could be found| |![Red](/identity-group/Circles/red.png)
Pseudonyms are based on EthrDID  | EthrDID was deemed unnecessary for the purpose of the project| |![Grey](/identity-group/Circles/grey.png)
Pseudonym is uploaded to a private Ethereum chain | Smart contract for managing pseudonyms is being developed | | ![Yellow](/identity-group/Circles/yellow.png)
Pseudonym is granted tokens | Smart Contract feature to grant tokens is being developed| | ![Yellow](/identity-group/Circles/yellow.png)
User sends document hash to blockchain and pays tokens for it  | Adding document hashs via the smart contract is being developed| |![Yellow](/identity-group/Circles/yellow.png)
User can link identity to pseudonym on blockchain | This feature is being developed in the smart contact | | ![Yellow](/identity-group/Circles/yellow.png)
User can privately proof ownership of a pseudonym | | |![Yellow](/identity-group/Circles/yellow.png)
A central authority can add patrons  | The function for this is on the smart contract but still needs debugging| |![Yellow](/identity-group/Circles/yellow.png)
Central authority can use a UI to add new patrons | | | ![White](/identity-group/Circles/white.png)
A patron can add a claim about a user such as "Has Doctor"  | | |![White](/identity-group/Circles/white.png)
Private Ethereum chain does not mine new blocks if there was not recent transaction | The test setup uses a script which preloads some js code that ensures the miner stops after a transaction has been validated by mining a few blocks after it| |![Green](/identity-group/Circles/green.png)
Private Ethereum chain has minimal proof of work difficulty | Genesis block starts difficulty at 0 and custom go-ethereum binary increases difficulty per block by only 1 | | ![Green](/identity-group/Circles/green.png)
Private Ethereum chain miner accepts 0 gas transactions | Start script for the Ethereum chain tells the miner to accept 0 gas transactions | |![Green](/identity-group/Circles/green.png)
Patron keys can be revoked | | |![White](/identity-group/Circles/white.png)
User keys can be revoked | | | ![White](/identity-group/Circles/white.png)
**Storage Group** | - | - | -
User sends document to document storage |  | | ![Red](/identity-group/Circles/red.png)
Document storage uses Self Certifying File System | | | ![Grey](/identity-group/Circles/grey.png)
Document storage saves document | The database needs to be set up in its final location, but the SQL statements for creating it are available. | | ![Yellow](/identity-group/Circles/yellow.png)
Document storage checks on the blockchain for document hash | | | 
Document storage is searchable | | | 
Document storage has defined data structure | | | 
Documents have searchable metadata | Fields for meta data were accounted for but not populated yet| | ![Red](/identity-group/Circles/red.png)
**Open** | - | - | -
User can create a SecTor account | Basic UAC management is being worked on at the moment and will be finished soon | | ![Yellow](/identity-group/Circles/yellow.png)
User can Login | See above | |![Yellow](/identity-group/Circles/yellow.png)
User can Logout | See above | | ![Yellow](/identity-group/Circles/yellow.png)
User data can be exported locally  | | |![White](/identity-group/Circles/white.png)
User data can be saved in encrypted form to an identity Storage server | | |![Yellow](/identity-group/Circles/yellow.png)
User can create an identity (keypair)  | | |![Yellow](/identity-group/Circles/yellow.png)
