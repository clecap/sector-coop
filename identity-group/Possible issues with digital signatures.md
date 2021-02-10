# Digital signatures

#### Introductory thoughts

* This is a system that will presumably not be used all the time. The tradeoff between time and security might in that regard be "solved" by entirely focusing on security.
* People's academic reputation might depend on how secure the system is! Let's keep that in mind, even if the link to money and that stuff is not so obvious at first glance.
* A decentralized system might be complemented by a kind of cross-certification of authorities. C.f. Certificate Authorities for the HTTPS protocol.

#### What type of signature to use?
Possibilies that come to mind are: 
* RSA - easy to implement (maybe for quick proof of work), but there are better possibilities
* ElGamal - very secure, very complicated.
* DSA - my personal favourite at the moment. More efficient than ElGamal. But again - do we need that?
* use standard crypto in the browser

#### How to deal with stolen keys?
We need to be aware that no matter how secure we design our own system, our users' systems might not be secure. If a key gets stolen, we have a potential problem, depending on how we deal with the deletion or alteration of publications. My suggestion:

* Give a user the possibility to revoke anything that has been posted on the system after a certain point in time.
* Problem: How do we prevent that the thief uses the stolen credentials to delete everything?
* I make two assumptions here: 
  1. If a key gets stolen, it's not lost, but another party also has it. 
  2. It is in the victim's institute's best interest to prevent tampering with their employee's work.
* If that is the case, revoke commands need to be signed by the university as well as the (stolen) key. That way we prevent that the thief alters anything permanently.

If the thief is not the university, that is of course. But then we might as well lose all faith in humanity.

###### But then, what if the universities' keys get stolen?
Then, right now, without accounting for that, we are pretty much fucked.

#### Other possible issues

* What if a university does not agree (anymore) on what has been published on their behalf?
 * Maybe a "deletion request" can be approved by the author. But this won't happen if there is a serious schism in between the parties. Do we want to have such a feature in the first place?

* What happens with an authors legacy in case of death?
  * If we are concerned about signing interactions with the platform using private keys, protecting one's legacy is something that we need to deal with. This also applies to possible deletions or alterations of publications possibly long in the future.
