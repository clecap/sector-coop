
# Self Certifying File System (SFS)
This article summarizes the core ideas when working with SFS. Source: http://cs.brown.edu/courses/csci2950-g/papers/sfs.pdf

#### General Idea
SFS takes a new approach to file system security: it removes key management from the file system entirely. SFS
introduces self-certifying pathnames—file names that effectively contain the appropriate remote server’s public key. Because self-certifying pathnames already specify public keys,
SFS needs no separate key management machinery to communicate securely with file servers. Thus, while other file
systems have specific policies for assigning file names to encryption keys, SFS’s key management policy results from the
choice users make of which file names to access in the first place.

SFS separates key revocation from key distribution,
preventing flexibility in key management from hindering recovery from compromised keys.

#### Security
SFS assumes that users trust the clients they use—for instance, clients must actually run the real SFS software to get
its benefits. For most file systems, users must also trust the
server to store and return file data correctly (though public, read-only file systems can reside on untrusted servers).
To get practical cryptography, SFS additionally assumes
computationally bounded adversaries and a few standard
complexity-theoretic hardness conjectures. Finally, SFS assumes that malicious parties entirely control the network.
Attackers can intercept packets, tamper with them, and inject new packets onto the network.
SFS cryptographically enforces all file access control. Users cannot read, modify, delete, or otherwise tamper with files without possessing a secret key.
SFS also cryptographically guarantees that results of file system operations come from the appropriate server or private
key owner.

#### Self-certifying Path names
As a direct consequence of its design goals, SFS must cryptographically guarantee the contents of remote files without
relying on external information. SFS cannot use local configuration files to help provide this guarantee, as such files
would violate the global file system image.

Without external information, SFS must obtain file data securely given only a file name. SFS therefore introduces
self-certifying pathnames—file names that inherently specify all information necessary to communicate securely with
remote file servers, namely a network address and a public key.
Every SFS file system is accessible under a pathname of the form sfs/Location:HostID. Location tells an SFS
client where to look for the file system’s server, while HostID tells the client how to certify a secure channel to that server.
Location can be either a DNS hostname or an IP address. [Maybe hard coded into the user client?]
HostID in SFS is the output of SHA-1(HostLocation, HostPublicKey).

#### Management
##### Secure links 
A symbolic link on one SFS file system can point to the self-certifying pathname of another. Users following symbolic links need not know anything about host ID's. [Might be useful]

#### User authentication
While self-certifying pathnames solve the problem of authenticating file servers to users, SFS must also authenticate users to servers.
On the client side, agents handle user authentication. When a user first accesses an SFS file system, the client delays the access and notifies his agent of the event. The agent can then authenticate the user to the remote server before the file access completes. On the server side, a separate
program, the authentication server or “authserver,” performs user authentication. The file server and authserver communicate with RPC.

### Implementation
The following nodes need to be existent in order for the system to work: 
* Authserver, seperated from the file system to handle user authentication.
* SFS Server, the actual documents are stored here.
* SFS client to communicate with the server.

See the linked document for more details.


### Current issues
* Because SFS has no widespread use, there is not much to already work with. I found a github repository (https://github.com/cnpm/sfs-client) that implements the SFS client.
  * I am not sure yet if we can run this in the web client in the background. It looks like it needs to be running on the user's system in order for his machine to actually support SFS.
* As far as I know there is no open source software regarding the SFS server. Getting it all implemented, and set up ourselves might be an overwhelming task from all that I can see right now. 
* Actual helpful documentation is scarce. There are a couple of papers available online (I linked the only good one I found at the top), outlining the rough working principle of SFS, but apart from that, we would have to do a lot of work only for this part of the system. Since our manpower is very limited, making the storage self-certifying might be something for version 2.0... It is worth discussing if we need it at this stage if we are adding various other layers of tamperproofing in form of our token and blockchain system already. 
