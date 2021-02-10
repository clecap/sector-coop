Table of Contents
─────────────────

1. Goal
2. Signing Protocol
3. Frameworks
.. 1. Paillier
.. 2. DSA


1 Goal
══════

  The goal of this doc is to briefly discuss how we should go about implementing blind signatures using vanilla DSA.


2 Signing Protocol
══════════════════

  The signing protocol that I think is most viable is described in [1]

  I don't think I can explain it here better without a lot of latex
  (which I am not very efficient at doing). At it's core, it uses shared
  two-party creation of the ephermal private key used for signing in
  DSA.

  This signing protocol is based on "Two-Party Generation of DSA
  Signatures" in [2], which was referenced in the blog that Jonathan
  found.

  It uses vanilla DSA and additionally, a Homomorphic encryption
  scheme. The paper has Security proofs for the sigining protocol with
  the use of the Paillier Cryptosystem.


[1]
<https://www.metzdowd.com/pipermail/cryptography/2004-April/006790.html>

[2] <http://www.ece.cmu.edu/~reiter/papers/2001/CRYPTO.pdf>


3 Frameworks
════════════

  The Protocol above would require an implementation of DSA and Paillier
  Cryptosystem in javascript, in addition to secure random number
  generation.


3.1 Paillier
────────────

  There exists a Javascript implementation for the Paillier Cryptosystem
  ([jspaillier]). It's only dependency is [jsbn].


[jspaillier] <https://github.com/mhe/jspaillier>

[jsbn] <http://www-cs-students.stanford.edu/~tjw/jsbn/>


3.2 DSA
───────

  For DSA, I think [Openpgp.js] is a good bet. I couldn't find a smaller
  library in the link that Jonathan that listed Javascript crypto
  frameworks that supported DSA. Most of them only had an implmentation
  for ECDSA. I did find a blind signature protocol that works with
  vanilla ECDSA ([A New Blind ECDSA Scheme for Bitcoin Transaction
  Anonymity]), however it uses a modified Paillier Cryptosystem which we
  would have to implement and maintain ourselves.



Edit by Dominik: jsrsasign - cryptography library in JavaScript (kjur.github.io) this might help. Open Source library that supports native DSA without the need for us to implement our own crypto.

Edit by Anant: Both Openpgp.js and jsrsasign do not support generation of DSA keypairs or generation of G, P, Q required for DSA. Unless there is a library that does the generation for us in a secure way, we may be limited to only one library, namely: pjcl.js. It's LICENSE is custom and, however I couldn't find a git repository for this project. The code needs to be edited to add 'exports.xyz = xyz' for use in node.js. I have tested some functions from this library after adding these extra lines and it works as expected. Only caveat is that we would have to do a lot of type conversion from jsbn to it's own Big Number library for working with jspaillier. 

Unfortunately it doesn't seem like we have any other alternative for DSA at least.

Edit by Arne: I'm not sure the pjcl.js license allows redistribution. It only mentions "incorporation" of certain parts of the code into other code, so I'm not sure it's actually usable. jspaillier is apparently less than 100 LoC. I have not looked at the necessary modifications for using ECDSA, but assuming the result would be of similar size, implementing and maintaining it may not pose too much of a burden, although there are of course dangers with a custom implementation. Alternatively, Mozilla's MPL licensed browserid-crypto contains some DSA code. Would that work?

Edit by Clemens: I see no problem with the picl.js license in redistribution. jsbn and jspallier look cool in all regards as well. One aspect has not yet been mentioned: Clarity and stability of inclusion. We do not have to be as strict as https://benjaminleiding.com/wp-content/uploads/2018/07/20180611_BIOC18-presentation-slides.pdf in all technical details. However: We must make sure that at all times we clearly know which software components are installed and part of the game. A simple npm -i could damage our code base ;-)


[1]
<https://www.metzdowd.com/pipermail/cryptography/2004-April/006790.html>

[2] <http://www.ece.cmu.edu/~reiter/papers/2001/CRYPTO.pdf>


[jspaillier] <https://github.com/mhe/jspaillier>

[jsbn] <http://www-cs-students.stanford.edu/~tjw/jsbn/>

[Openpgp.js] <https://github.com/openpgpjs/openpgpjs/>

[A New Blind ECDSA Scheme for Bitcoin Transaction Anonymity]
<https://dl.acm.org/doi/abs/10.1145/3321705.3329816>

