# SecTOR Project

## Table of Conents


### Documentation

| Title | Content | Authors| Last Modified | Link |
| --- | --- | --- | --- | --- |
| Sequence Diagram | Core System functionality, e.g. Account creation etc | Anant, Jonathan | 14.12.2020 | [Link](https://github.com/clecap/sector-coop/blob/main/Documentation/Graphics/Sequence-Diagram/Sequence_Diagram_20201214.pdf) 
| API | Identity API functions that need implementing | Anant, Jonathan | 04.12.2020 | [Link](https://github.com/clecap/sector-coop/blob/main/Documentation/Documents/API%20functions%20for%20identity%20component.md) 
| Data Structures | Data structures and types needed for the identity handling | Anant, Jonathan | 04.12.2020 | [Link](https://github.com/clecap/sector-coop/blob/main/Documentation/Documents/Datastructures%20for%20Identity%20Component.md) 
| Class Diagram | | Jonas | 06.01.2021 | [Link](https://github.com/clecap/sector-coop/blob/main/Documentation/Graphics/UML/class%20diagram.png) 
| Feature Progress | Current progress of planned features visualized with traffic lights | Jonathan, Anant, Dominik | 09.02.2021 | [Link](https://github.com/clecap/sector-coop/blob/main/Documentation/Feature%20Progress.md)
| Test setup instructions | Step by step guide for setting up a test environment with a private Ethereum blockchain | Jonathan | 09.02.2021 | [Link](https://github.com/clecap/sector-coop/blob/Documentation/Documents/Test%20Chain%20Setup%20Guide.md)
| Entity Relationship Diagram | ER Diagram for storage node | Jonas | 01.12.2020 | [Link](https://github.com/clecap/sector-coop/blob/main/Documentation/Graphics/UML/new%20entity%20relationship%20diagram.png) |
| Block Diagram | System snapshot for rough system parts with functionality | Jonas | 09.12.2020 | [Link](https://github.com/clecap/sector-coop/blob/main/Documentation/Graphichs/UML/block%20Diagram.png) 
| Flow Diagram | Flow for various system use cases | Jonas | 06.01.2021 | [Link](https://github.com/clecap/sector-coop/blob/main/Documentation/Graphics/UML/flowdiagramn-new.svg) 

### Informal thoughts

| Topic | Authors | Link |
| --- | --- | --- |
| Reference Architecture | Clemens | [Link](https://www.overleaf.com/project/5fd13d6f13a41fe683dfbbb1) 
| DSA Blind Signature Protocol | Anant | [Link](https://github.com/clecap/sector-coop/blob/main/Documentation/Research%20and%20Brainstorming/DSA%20Blind%20Signature%20Protocol.md) 
| How to sign blindly | Jonathan | [Link](https://github.com/clecap/sector-coop/blob/main/Documentation/Research%20and%20Brainstorming/How%20to%20blind%20signature.md) 
| Identity | Jonathan | [Link](https://github.com/clecap/sector-coop/blob/main/Documentation/Research%20and%20Brainstorming/Identity%20notes.md) 
| Self-certifying storage (SFS) | Dominik, Clemens | [Dominik](https://github.com/clecap/sector-coop/blob/main/Documentation/Research%20and%20Brainstorming/Self-certifying%20storage%20(SFS).md), [Clemens](https://www.overleaf.com/project/5fb3af44d95e01586e3c79fb) 
| Possible issues with digital signatures | Dominik | [Link](https://github.com/clecap/sector-coop/blob/main/Documentation/Research%20and%20Brainstorming/Possible%20issues%20with%20digital%20signatures.md) 
| Of the Record private proof of identity | Anant | [Link](https://github.com/clecap/sector-coop/blob/main/Documentation/Research%20and%20Brainstorming/OTR%20implementation%20for%20Private%20Linking.md)

* * *

## Glossary

| Terminus | Definition |
| --- | --- |
| Blind Signature | A way of having a party sign something without the party knowing what it exactly signed and later still being able to verify the signature.
| Blockchain | An Ethereum private blockchain used to verify certain events happening in our system. The blockchain saves public pseudonym information, document hashes and claims about pseudonyms. 
| Central Authority (CA) | A pseudonym that is authorized by to sign other pseudonym to make them patrons. Could also be implemented as a hierarchy similar to SSL signing hierarchy. 
| Datablob | Encrypted user data related to a user account saved in the Identity Storage of a user. The encryption is based on AES256 key which is also attached to the user account but encrypted using the password. The identity storage should at no point be able to decrypt the datablob. 
| Document | Any file (usually pdf) that is uploaded to the document storage. Can either be a new paper, a new version to an existing paper, a comment or a review to a paper. For the document storage to accept a document its hash must be present on the blockchain an verified such that the author of the document has paid the required amount of tokens. 
| Document Hash | The Sha256 hash of a document. Needs to be part of a transaction that adds the document to the system such that the document storage can find the document on the blockchain. 
| Document Storage | A storage component that accepts documents and can be searched. Before accepting a new document, it needs to calculate the Document Hash and check if the hash is present in an accepted transaction on the blockchain. Can also be searched. 
| DSA | Digital Signature Algorithm, a way of digitally signing documents which can be adapted to perform blind signatures.
| EthrDID | Refers to the data structure used to store pseudonym data as imposed by [this Github repository](https://github.com/uport-project/ethr-did), a EthrDID is part of each Pseudonym. 
| Identity | Represents the true identity of a person. A single SecTor Account should exists for each identity and one identity may have any number of pseudonyms. Not to be confused with EthrDID which is part of the technical implementation of pseudonyms. 
| Identity Storage | A storage component that only supports CRUD operations for SecTor Acc and only receives encrypted user data. It only serves as a private backup for user data, so users only have to hold on to their SecTor Acc password. 
| Patron | A special pseudonym on the blockchain that is allowed to sign other pseudonyms to give them tokens. This can for example be a university. To become a patron the signature needs to be signed by a super pseudonym which can either be one central authority pseudonym or part of a key hierarchy (similar to SSL certificate hierarchy). For example a university could be such a patron, handing out tokens to its researchers. 
| Pseudonym | A pseudonym is one name under which a user can publish documents. A pseudonym is always related to an identity but the identity doesn't need to be public on the blockchain for the pseudonym to be valid. Before a user can publish under a pseudonym, a patron needs to sign that pseudonym. 
| RSA | Rivest-Shamir-Adleman, public-key cryptosystem, relatively simple to implement and with existing implementations of blind signature, was however considered to be too insecure for our intents.
| SecTOR Account | A useraccount on our Identity Storage system. For each user a keypair is generated to represent that users identity which is used for proof of authorship. The Identity storage sees a username and linked to it a datablob. Given the correct password, the identity storage will allow reads, updates and delete to the user account and datablob. One SecTor Acc may have any number of identities. 
| Token | A sort of currency that is bound to a pseudonym and cannot be traded with other identities. By registering a pseudonym with a patron, one is granted tokens. To submit documents one needs to make an transaction which costs a certain amount of tokens. 
| UserClient | JS Userinterface, which handles most of the logic. Allows login to the identity storage to downloaded ones own user data and display it. One can handle its identities here, create new identities, apply to a patron for tokens, use tokens to upload a new document and search for documents. Should also support exporting and importing data blobs, such that users don't have to use the Identity Storage or can make backups for themselves. 