
- <span style="color:red; font-size: 150%">&#11044;</span> Feature has made some progress
- <span style="color:yellow; font-size: 150%">&#11044;</span> Feature is partially complete
- <span style="color:green; font-size: 150%">&#11044;</span> Feature has been completed
- <span style="color:gray; font-size: 150%">&#11044;</span> Feature has been scrapped
- <span style="color:white; font-size: 150%">&#11044;</span> Feature has not been touched upon

Feature | Current State | Notes | 🚦
--- | --- | --- | :-:
**Project specifications** | - | - | -
User can get a unique uuid which he can verify | Public private key pair is part of identity | |<span style="color:yellow; font-size: 150%">&#11044;</span> 
User can publish a document | Database structure exists and smart contract is being developed | |<span style="color:yellow; font-size: 150%">&#11044;</span> 
User can look for papers  | Search via direct document hash is being built| |<span style="color:red; font-size: 150%">&#11044;</span>
User can download and read papers  | | |<span style="color:white; font-size: 150%">&#11044;</span>
User can write a comment for a paper and link it to the paper | | |<span style="color:white; font-size: 150%">&#11044;</span>
User can write a review for a paper and link it to the paper and himself  | | |<span style="color:white; font-size: 150%">&#11044;</span>
User can upload a new version of a paper and link it to the previous version | | |<span style="color:white; font-size: 150%">&#11044;</span> 
Papers can be grouped in a Journal | | |<span style="color:white; font-size: 150%">&#11044;</span> 
Meta data can be attached to a document  | Fields for meta data in database and in the smart contract are open but not used yet| |<span style="color:red; font-size: 150%">&#11044;</span>
A user can verify integrity of a document  | Smart Contract will save document hash but is still in development| |<span style="color:yellow; font-size: 150%">&#11044;</span>
Identifier in the system can be linked to ORCID | | |<span style="color:white; font-size: 150%">&#11044;</span> 
Frontend user client for users | | |<span style="color:red; font-size: 150%">&#11044;</span> 
Blockchain runs in a decentralized P2P network where universities can join and leave any time | | |<span style="color:white; font-size: 150%">&#11044;</span> 
Document/Identity storage run in a decentralized P2P network where universities can join and leave any time | | | <span style="color:white; font-size: 150%">&#11044;</span> 
Document search works across a decentralized P2P network  | | |<span style="color:white; font-size: 150%">&#11044;</span>
Documents are automatically shared between nodes | | |<span style="color:white; font-size: 150%">&#11044;</span> 
**Identity Group** | - | - | -
User can create a pseudonym | Smart contract with this feature is being developed| |<span style="color:yellow; font-size: 150%">&#11044;</span>
Blind signature can be used to sign a pseudonym | RSA Blind signatures work outside of smart contract, smart contract integration is being developed| |<span style="color:yellow; font-size: 150%">&#11044;</span> 
DSA based blind signatures are used | No library for validating blind signatures on smart contracts could be found| |<span style="color:red; font-size: 150%">&#11044;</span>
Pseudonyms are based on EthrDID  | EthrDID was deemed unnecessary for the purpose of the project| |<span style="color:gray; font-size: 150%">&#11044;</span>
Pseudonym is uploaded to a private Ethereum chain | Smart contract for managing pseudonyms is being developed | | <span style="color:yellow; font-size: 150%">&#11044;</span> 
Pseudonym is granted tokens | Smart Contract feature to grant tokens is being developed| | <span style="color:yellow; font-size: 150%">&#11044;</span>
User sends document hash to blockchain and pays tokens for it  | Adding document hashs via the smart contract is being developed| |<span style="color:yellow; font-size: 150%">&#11044;</span>
User can link identity to pseudonym on blockchain | This feature is being developed in the smart contact | | <span style="color:yellow; font-size: 150%">&#11044;</span> 
User can privately proof ownership of a pseudonym | | |<span style="color:yellow; font-size: 150%">&#11044;</span>
A central authority can add patrons  | The function for this is on the smart contract but still needs debugging| |<span style="color:yellow; font-size: 150%">&#11044;</span>
Central authority can use a UI to add new patrons | | | <span style="color:white; font-size: 150%">&#11044;</span>
A patron can add a claim about a user such as "Has Doctor"  | | |<span style="color:white; font-size: 150%">&#11044;</span>
Private Ethereum chain does not mine new blocks if there was not recent transaction | The test setup uses a script which preloads some js code that ensures the miner stops after a transaction has been validated by mining a few blocks after it| |<span style="color:green; font-size: 150%">&#11044;</span>
Private Ethereum chain has minimal proof of work difficulty | Genesis block starts difficulty at 0 and custom go-ethereum binary increases difficulty per block by only 1 | | <span style="color:green; font-size: 150%">&#11044;</span> 
Private Ethereum chain miner accepts 0 gas transactions | Start script for the Ethereum chain tells the miner to accept 0 gas transactions | |<span style="color:green; font-size: 150%">&#11044;</span> 
Patron keys can be revoked | | |<span style="color:white; font-size: 150%">&#11044;</span> 
User keys can be revoked | | | <span style="color:white; font-size: 150%">&#11044;</span>
**Storage Group** | - | - | -
User sends document to document storage | | | <span style="color:red; font-size: 150%">&#11044;</span>
Document storage uses Self Certifying File System | | | <span style="color:gray; font-size: 150%">&#11044;</span> 
Document storage saves document | | | <span style="color:red; font-size: 150%">&#11044;</span>
Document storage checks on the blockchain for document hash | | | 
Document storage is searchable | | | 
Document storage has defined data structure | | | 
Documents have searchable metadata | Fields for meta data were accounted for but not populated yet| | <span style="color:red; font-size: 150%">&#11044;</span>
**Open** | - | - | -
User can create a SecTor account | | | <span style="color:yellow; font-size: 150%">&#11044;</span>
User can Login | | |<span style="color:yellow; font-size: 150%">&#11044;</span> 
User can Logout | | | <span style="color:yellow; font-size: 150%">&#11044;</span>
User data can be exported locally  | | |<span style="color:white; font-size: 150%">&#11044;</span>
User data can be saved in encrypted form to an identity Storage server | | |<span style="color:yellow; font-size: 150%">&#11044;</span> 
User can create an identity (keypair)  | | |<span style="color:yellow; font-size: 150%">&#11044;</span>
