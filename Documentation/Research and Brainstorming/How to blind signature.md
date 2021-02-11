This document explains the theory behind blind signatures based on RSA and DSA keys.

On the meeting from the 26.11 it was decided to use DSA blind signatures!

### Available libraries:
There are a some public more or less well maintained (https://gist.github.com/jo/8619441).
nodejs also has a crypto component (https://nodejs.org/api/crypto.html) which we could use instead of pulling in additional libraries.
This libraries do not include options for blind signatures as far as I know (I did not check every single one).
I found one implementation of blind signatures in js based on RSA (https://github.com/kevinejohn/blind-signatures) however the repo wasn't updated in over a year.
The code itself builds on node-rsa and is with 100 lines not too complex. We might be able to adapt the solution for our needs by re-implementing it as not to depend on too many git repositories. We don't want our project depend on a small one dev library that might vanish anytime when Github decides to suspend that one dev. (Some major frameworks do this but at least the outcry is loud enough that it gets fixed and we just update the frameworks.)

### About RSA keys:
Quick explanation of RSA keys in case someone needed a reminder.
(Source: https://en.wikipedia.org/wiki/RSA_(cryptosystem))
Not going into how the keys are generated, as we got standard libraries for that.
A key pair consists of three very large positive integers *e*, *d* and *n*.
*e* and *n* are known as part of the public key and *d* is secret.
For the three integers holds:
$(m^e)^d = m(\mod n)$
$(m^d)^e = m(\mod n)$
Encryption works as follows:
Given a message *M* of plain text, the message is padded using an agreed-upon padding protocol to get *m*.
$m^e \equiv c(\mod n)$
Here c is the cipher-text.
To decrypt it d is used:
$c^d \equiv (m^e)^d \equiv m (\mod n)$
By reversing the padding scheme on *m*, *M* is received.
Normal signatures use a hash of the message instead of the message itself and the sender uses its private key *d* to sign the hash and by decrypting it using the public key, the receiver can verify the signature.

### The goal of blind signature is:
- A creates a message
- B performs a blind signature on the message
- B does not know the contents of the message
- B can later verify that it signed the message

### About RSA blinds signatures
(Source: https://en.wikipedia.org/wiki/Blind_signature)
Two parties A and B. A wants a message to be blindly signed by B.
B has a key pair, where *e* and *n* are public.
The steps are the following:
1. A gets *e* and *n* from B
2. A blinds the message
3. A sends blinded message to B
4. B signs the message
5. B sends the message back to A
6. A unblinds the message
7. A verifies the signature
8. A sends the normal message and the unblinded message to B
9. B verifies that it had signed the message

#### 2. blinding the message
A random value *r* is computed as a relative prime to *n*, ($\gcd(r,n) = 1$).
Then $r^e$ is used as the blinding factor such that:
$m' \equiv mr^e (\mod n)$ where *m'* is the blinded message.

#### 4. signing the message
B simply applies its signature to the message:
$s' \equiv (m')^d (\mod n)$
where *s'* is the blind signature.

#### 6. unblinding the message
A reverses the blinding factor and reveals *s*, the validly signed message.
$s \equiv s' * r^{-1} (\mod n)$

#### 7. verifying the signature
Simply apply B's public key to decrypt the signature and the original message can be verified.
$s^e \equiv m (\mod n)$

#### 9. verifying the signature
B signs the message *m* and compares it to the unblinded message. They should be equal.
$m^d \equiv s (\mod n)$

The Wikipedia article about RSA signatures further mentions possible attacks by using the blind signature to get B to decrypt messages by signing them which it had encrypted using the respective public key.
The solution for this is to use different key pairs for encryption and signing.

#### 10. Security notes
The multiplicative nature of RSA signatures yields the possibility for chosen message attacks which enables the attacker to sign any document. This can and must be remedied by only signing hashed messages.
"Blind signing" might help a little bit, but if not all contributions to the system are signed anonymously, we need to do it anyway if we decide to use RSA.

### About DSA keys:
The nodejs crypto component also supports DSA keypairs (called EC keypairs).
Example on how to generate EC keypairs: https://coolaj86.com/articles/new-in-node-native-rsa-ec-and-dsa-support/

(Source: https://en.wikipedia.org/wiki/Digital_Signature_Algorithm)
Here I paraphrase the explanation from the Wikipedia article as I am myself and some of you may not be familiar with DSA yet and we should understand how DSA works normally before pulling stunts like blind signatures.

Key generation has two phases, where the results of the first are shared between all users and the second generates the user specific keys.

#### Shared parameters
First pick a cryptographic hash function *H* with output length |*H*|.
Then pick a key length *L* usually 2048 or 3072.
Pick the modulus length *N* such that $N < L$ and $N \leq |H|$, usually 256.
Choose an *N*-bit prime *q*.
Choose an *L*-bit prime *p* such tat $p-1$ is a multiple of *q*.
Choose an integer *h* randomly from $2$ to $p-2$
Compute $g = h^{p-1/q)} (\mod p)$. If $g=1$, pick a different *h* and try again.
The algorithm parameters are $(p,q,g)$ and need to be shared.

#### Individual key generation
Pick a random integer *x* from $1$ to $q-1$.
Compute $y = g^x (\mod p)$
*x* is the private key and *y* is the public key.

#### Signing
Given a message *m*.
Choose an integer *k* randomly from $1$ to $q-1$.
Compute $r = (g^k (\mod p)) (\mod q)$. In case $r = 0$, start again with a different *k*.
Compute $s = (k^{-1}(H(m) + xr)) (\mod q)$. In case $s = 0$, start again with a different *k*. Here *+* means concatenation.
The signature is $(r,s)$.
$g^k$ and $k^{-1}$ may be computed before *m* is known to save time (see source for more details).

#### Verifying a signature
Given a signature $(r,s)$ and a message *m*.
Verify that $0 < r < q$ and $0 < s < q$.
Compute $w = s^{-1} (\mod q)$
Compute $u_1 = H(m) * w (\mod q)$
Compute $u_2 = r * w (\mod q)$
Compute $v = (g^{u_1}y^{u_2} (\mod p)) (\mod q)$
The signature is valid if $v = r$

#### Security notes
*k* must be generated randomly for each signature or it is possible to compute the private key *x*.
Furthermore, the general idea of DSA's security can be boiled down to the discrete logatithm problem. The only feasible attack on DSA is brute force (which is good) if hashed messages are signed instead of plain text, but this is problem scales "only" with the square root of the key length. We need to be sure to use the longest possible keys for that reason. 

### About DSA blind signatures
(Source: https://blog.cryptographyengineering.com/a-note-on-blind-signature-schemes/)
B has a public key $(g,p,q,y)$ where $(g,p,q)$ are the shared parameters and *y* is the public key.
*H* is a cryptographic hash function.
A has a message *m* it wants B to blindly sign.

1. B picks *k* randomly between $1$ and $q-1$
2. B generates $r = g^k (\mod p)$
3. B sends *r* to A
4. A picks *a* and *b* randomly between $1$ and $q-1$
5. A computes $r' = r*(g^a)*(y^b) (\mod p)$
6. A computes $e' = H(m + r')$ Here again + means concatenation
7. A computes $e = e' - b (\mod q)$
8. A sends *e* to B
9. B computes $s = ex + k (\mod q)$
10. B sends *s* to A
11. A computes $s' = s + a (\mod q)$

Now $(r',s')$ is a valid signature of *m*.
To verify it, A can send $(r', s')$ as well as *m* to B and B can check the signature as shown in the section "Verifying a signature".

### Further notes
Further schemes are described and linked in the second half of this article:
https://blog.cryptographyengineering.com/a-note-on-blind-signature-schemes/

### Randomness

https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues