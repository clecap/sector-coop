# Identity

## Purpose of identity

Every user of our system should have at least one but can have multiple identities.
When submitting a document, the user needs to provide an identity such that the user can prove that ownership of the document if required.

Further it should be possible:
- To search for documents based on an identity
- To add new versions of a document
- Authenticate the owner of an identity
- Link multiple identities together
- Handle tokens that are consumed when adding new documents

Should it be possible to:
- Remove documents
- Update documents

## Purpose of credentials

It should be possible for (certain) users to make claims about the identity of another user. The user can accept the claim and add it to the credentials of its identity.

Further it should be possible:
- To not accept a claim as it is incorrect or outdated
- For claims to be only valid for a certain period of time
- Verify a claim (including the issuer of the claim)

Should it be possible to:
- Revoke claims
- Present only the necessary information for a request/Should there be private claims?

## Proposal for a data structure

JSON based documents saved on our blockchain.
Besides the data structure also CRUD methods on the data structure and special interactions like making a claim about an identity as well as resolving/querying/searching for data also need to be implemented.

### Minimal Setup
Any JSON object needs to be signed by a valid identity such that tokens can be removed from that identity.
#### User-Identity
- identity id itself (globally unique string uuid)
- public key (for verification)
- Other identities (Requires signature of the identity to prove it)
- credentials (Claims the user accepted by signing them)
- owner signature

Sub types: Claim issuer, Organizations (e.g. Universities)

#### Document
The actual document is assumed to be saved in a database that is not part of the blockchain.
- owner id
- link to the actual document (Where to find the actual document in the db)
- creation timestamp
- version
- link to other versions
- owner signature (with correct DID this should not be necessary)
- active (in case the actual document was removed for some reason)

Sub types: Paper/Article, Comment, Review

#### Claim
- user id  (who the claim is about)
- issuer id (must be allowed to make claims)
- timestamp
- valid until
- type (General description, optional)
- claim itself (for example "has a PhD")
- issuer signature (should be verifiable via the issuer id)

## Open Questions

* How should the data be managed, meaning what is the exact procedure to adding a document or a claim to an identity? 
* Should the blockchain only record updates and to gain the full up to date identity of a user, it would need to assemble the original creation of the identity and apply all updates to it or post the entire user identity on each update?
* What characters are allowed in user submitted strings like identities?
* Who actually creates the identity when all other creation action require the expense of tokens?
* How will tokens be generated/should tokens be their own data type or just a number on an identity?
* What public key base encoding should we use?

## Blind signature cryptosystem
https://keybase.pub/saintaquinas/Chaum.BlindSigForPayment.1982.PDF

The goal is to be able to make payments from A to B via a bank without allowing the bank alone to trace from who to who the payment was.
Further only if A wishes it, the payment can be traced.
The basic procedure is that
1. A creates a note x, where x is random.
2. A encrypts the note x with his own public key c and sends c(x) to the bank.
3. The bank simply signs it and it with its own private key and sends s'(c(x)) back.
4. A decrypts this using his own private key c'(s'(c(x))) = s'(x).
5. A checks using the banks public key s(s'(x)) = x that the banks signature is correct.
6. Some time later A gives s'(x) to B in return for a receipt that documents what was purchased, when and a copy of s'(x).
7. B can use the banks public key to check if the note is correct.
8. B can forward s'(x) to the bank.
9. The bank checks the note
10. The bank clears the note and gives the money to B

The paper describes a function r that is used to form x and the bank can use r to find the original note from A.
However this is only described as a redundancy checking predicate r, and in no way apparent from the description. What exactly does r do?

Perhaps a more compact description: https://blog.cryptographyengineering.com/a-note-on-blind-signature-schemes/ https://nickler.ninja/slides/2018-bob.pdf

## The Path to Self-Sovereign Identity
https://www.lifewithalacrity.com/2016/04/the-path-to-self-soverereign-identity.html

Did the author seriously write 22st instead of 22nd?

The need for a self sovereign identity comes from ones identity being defined via state-issued documents which are only valid in this state and even in this state might be revoked.
In the internet central authorities are responsible for Root CAs and users have to handle an identity for almost every website they use.

A self-sovereign identity puts the user in the center such that not authority can take away a users identity.
Ten principles of Self-Sovereign Identity:
- Existence. Users identity must exist independently.
- Control. Users control their own identity, can always refer to it, update it or even hide it. Others still can make claims about a user.
- Access. Users must have access to their own data. Users must always be able to access all claims and other data within their identity.
- Transparency. Systems and algorithms must be in the open as well as how they are managed and updated. Anyone should be able to see how they work.
- Persistence. Identities should last as long as the user wishes and even persist rotation of private keys. However the user also has the right to be forgotten and be able to dispose of an identity.
- Portability. The identity must not be tied to a single third party. Even a trusted third party may disappear one day and users may move somewhere else in the world. They should be able to take their identity with them.
- Interoperability. Identities should be as widely usable as possible. To be truly of value identities need to be usable across international borders and be global identities.
- Consent. Users must agree to sharing their data. Claims to the identity must require the users consent.
- Minimalization. Only the minimal amount of data about an identity should be disclosed.
- Protection. The rights of the user must be protected over the needs of the network. Identity authentication must occur independently, censorship-resistant, force-resistant and decentralized.

The article does not claim that these principles are all there is and they should be the basis for discussion.

## Decentralized Identifiers (DIDs) v1.0
https://w3c.github.io/did-core/
Draft document for W3C recommendation.

Goal of DID is provide globally unique identifiers that are not bound to third party organizations and can be used to authenticate ones identity using cryptographic proofs. 

https://w3c.github.io/did-core/#a-simple-example
A minimal example of a DID consists of a URI scheme identifier for example "did"
as a prefix. Then an identifier for the DID method within this scheme and finally an identifier specific to the DID method.
`did:method:someuniquecode`
This would resolve to a DID document which would contain information on the DID, ways to authenticate the DID controller and services to interact with the DID.

https://w3c.github.io/did-core/#architecture-overview
A DID is extend by a DID URL to locate specific information like a public key in the DID.
DID subject is the entity identified by the DID.
DID document is linked to a DID.
DID controller makes changes to documents.
DID is saved in a verifiable data register for example a blockchain.
DID methods are mechanism to generate DID and DID documents.
DID resolver takes a DID and finds related DID documents.

DID document verification may be done via public keys. Make sure to agree on what base encoding format is used for the keys.
DID methods should define what authentication allows to do what with the document. Some authentication may allow updating or deleting a DID document but other stronger authentication may also allow updating or deleting the DID document used for authenticating the original document.

DID documents should be based on JSON at least on top level.

DID methods that should be implemented:
Create, Read, Verify, Update, Deactivate

https://w3c.github.io/did-core/#binding-of-identity
To bind a DID to a DID document, the DID must resolve to the DID document and the other way around using a DID method and the id on the document must match the DID. The DID method implements the necessary checks even if the DID document is not signed.

To verify control of a public key that is noted on a DID document, send a challenge message with the description from the DID document and a nonce to an appropriate service endpoint described in the DID document.

It is assumed that DID documents are publicly available.

## Verifiable Credentials Data Model 1.0
https://www.w3.org/TR/vc-data-model/

The goal is to be able to express third-party verified personal information on the web in a machine readable way. Such credentials should be cryptographically secure, privacy respecting and machine-verifiable.

Part of a verifiable credential can/should be:
Subject of the credential, issuing authority, type of credential, further details on the credential, evidence on how/when the credential was derived, constraints of the credential

The credentials should be saved to a verifiable data registry such that one can request and verify credentials received from a subject.

To minimize the shared data, a presentation of a credential should only show the necessary information for a request.

Subjects need to be able to dispute claims about them for example if the claim is incorrect or outdated.

## Ethr-DID Library
https://github.com/uport-project/ethr-did

Library for building DID based on Ethereum addresses.
Probably worth for testing out how DID works in practice and to see if it can be adapted to work with arbitrary addresses and not just Ethereum.

## ethr DID Resolver
https://github.com/decentralized-identity/ethr-did-resolver

Same as Ethr-DID Library focused on Ethereum but might be very worth checking out for quickly constructing a prototype.
