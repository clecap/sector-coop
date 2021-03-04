# SecTor-Coop

SecTor-Coop is a student project where students from the universtities **Clausthal**, **Göttingen** and **Rostock** cooperate.
The goal of the project is to develop a prototype of a blockchain based publishing system.

## Use Case
Imagine a scientist publishes his or her thoughts **on a blog** and gets good reviews on this. From a _research point of view_, this sounds great! From an _academic perspective_, traditional journal and conference-type of publications are expected, as only they are considered reliable, peer-reviewed proofs of academic achievements. The owner of a science blog could easily fake positive reviews and manipulate the texts in many ways.

**This is what we want to change.** We want to _disrupt the academic publishing business_ by offering everybody the chance of writing papers, publishing them freely, collecting authentic reviews from their peers and using this as basis for their academic achievement record. We shall use _blockchain technology_ to ensure the authenticity of reviews and feedback. 

Further, it should be possible for researchers to publish under a number of pseudonyms without revealing their real identity with the option to publicly or privately link ones identity to a pseudonym.

### More about this
* **Core paper** [Cap, Leiding: Blogchain - Disruptives Publizieren auf der Blockchain ](https://link.springer.com/article/10.1365/s40702-018-00470-w) has been published in 2018 at HMD Wirtschaftsinformatik. It is open access and can be read under the link above. You can find open versions with a Google query as well. 
* **Extended version of this paper** as a chapter in the book [Fill, Meier: Blockchain: Grundlagen, Anwendungsszenarien aund Nutzungspotentiale](https://link.springer.com/book/10.1007/978-3-658-28006-2). We can share this only on a private basis due to copyright restrictions by the publisher. Your university library might have a Springer Link subscription.
* Finally, one of us gave a **keynote speech on this at the 2019 meeting of the German computer society** GI and the slides of this talk are available [here](https://github.com/clecap/blockchain-masterclass/blob/master/vortrag-v03.pdf). This talk also provides links to four proof of concept projects we have completed and to three student Theses, which had this concept at their core.

## Architecture
The final SecTor system will consist of:
- A user client written in JS and running in the browser
- A database for user data called Identity-Server
- A database for published documents
- An Ethereum based blockchain

The user client handles most of the business logic, allowing users to login with an account and interact with the rest of the system.
The Identity-Server holds the user accounts and the user data, however since the user data contains Ethereum key pairs, the Identity-Server only sees the user data in encrypted form and only after downloading the data into the user client is the user data decrypted.
The document database allows everyone to search for published documents either by the hash of the document or by metadata.
The Ethereum blockchain handles all information that must be verifiable via a smart contract.

Each user account has one identity which is a public private key pair. Each account may have any number of pseudonyms which each hold an Ethereum account. There are also special pseudonyms called Patron and CA (central authority). For a pseudonym to publish a document in the system, it must first get approved by a Patron. The Patron either publicly or blindly signs the Ethereum address of the pseudonym and the user registers the pseudonym on the blockchain. The registered pseudonym receives an initial grant of tokens, from which it must pay to add the hash of the document it wants to publish to the blockchain. Finally the document can be submitted to the document database which will verify that the document hash exists on the blockchain before accepting the document.

Patrons usually correspond to universities and must be added by the CA to the system.
In its final version, SecTor shall be a decentralized system where nodes may join and leave the network and the blockchain uses consensus to stay in sync while the document databases also exchange data, so a user may connect to any host in the system to receive the user client.

## Getting Started
### Map to the repository
This repository consists of the major two sections **Documentation** and **Source**, where **Documentation** holds all the documents and notes and **Source**, which holds all the code and configuration files.

Under **Documentation** in the sub folder **Documents** are files describing existing or planned features as well as guides on how to set up parts of the system.
The **Research and Brainstorming** sub folder is a place for archiving organized thoughts and less concrete plans.
The **Documentation** folder also holds the **Feature progress.md** which shows the current state of planned features of the system as well as the **Table of Contents.md** which lists all documents, gives an idea what they are about as well as a glossary that explains the jargon of this project.
Both of those files should be kept up to date as the project develops.

Under **Source** in the sub folder **Solidity Smart Contract** is the truffle environment for developing and deploying the smart contract. In the **Test Ethereum Chain** sub folder are some scripts for controlling an Ethereum chain as well as the genesis block configuration. Further, **User-Client**, **Identity-Server** and **Database** hold the code for the respective system parts.
Finally, the sub folder **Prototypes** holds code demonstrations and proof of works that are similar to the **Research and Brainstorming** section but in code.

### Contributing to the smart contract and blockchain development
The code for the smart contract and the configuration for the private Ethereum blockchain can be found as described in the 'Map to the repository' section.
The first step to start working on either of those should be to set up a test environemt. Instruction for this can be found [here](https://github.com/clecap/sector-coop/blob/main/Documentation/Documents/Test%20Chain%20Setup%20Guide.md).

### Contributing to the User-Client 
The User-Client Documentation, Usage, Copyright Notices and Contribution Guide can be found [ here ](/Source/User-Client/README.md).

The smart contract still needs to be expanded to cover further use cases such as patrons making claims about pseudonyms and linking comments or reviews to existing documents. 
For the Ethereum blockchain, only single node networks have been tested so far, instructions and automation for setting up multi-node private Ethereum networks still need to be developed.

### Current Feature Progress


## Copyright notices
This project uses the [SolRsaVerifiy](https://github.com/adria0/SolRsaVerify) project in an adapted version as it has been turned into an internal library for the main smart contract of the project. SolRsaVerify is published under GPL-3.0.
This project uses a custom binary of [geth](https://github.com/ethereum/go-ethereum) where the calculation of block difficulty has been simplified to always return 1. go-ethereum is published under LGPL-3.0.
