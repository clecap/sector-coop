const secureRandom = require('secure-random');
const BigInteger = require('jsbn').BigInteger;
const sha256 = require('js-sha256');
const NodeRSA = require('node-rsa');

function keyGeneration(params) {
  const key = new NodeRSA(params || { b: 2048 });
  return key;
}

function keyProperties(key) {
  return {
    E: new BigInteger(key.keyPair.e.toString()),
    N: key.keyPair.n,
    D: key.keyPair.d,
  };
}

function messageToHash(message) {
  const messageHash = sha256(message);
  return messageHash;
}

function messageToHashInt(message) {
  const messageHash = messageToHash(message);
  const messageBig = new BigInteger(messageHash, 16);
  return messageBig;
}

function messageToEMSA_PKCS1_v1_5(message){
    // https://tools.ietf.org/html/rfc3447#section-9.2
    SHA256_DIGEST_INFO = "30" + "31" + "30" + "0d" + "06" + "09" + "60" + "86" + "48" + "01" + "65" + "03" + "04" + "02" + "01" + "05" + "00" + "04" + "20" ;
    T = SHA256_DIGEST_INFO + messageToHash(message);
    t_len = 51;

    ps_len = 256 - t_len - 3;
    PS = "ff".repeat(ps_len);

    EM = "00" + "01" + PS + "00" + T;
    console.log(`EMSA-PKCS1-v1_5 encoded Message: ${EM}`);
    return EM;
}

function messageToEMSA_PKCS1_v1_5Int(message){
    return new BigInteger(messageToEMSA_PKCS1_v1_5(message), 16);
}

function blind({ message, key, N, E }) {
  const messageHash = messageToHashInt(message);
  N = key ? key.keyPair.n : new BigInteger(N.toString());
  E = key
    ? new BigInteger(key.keyPair.e.toString())
    : new BigInteger(E.toString());

  const bigOne = new BigInteger('1');
  let gcd;
  let r;
  do {
    r = new BigInteger(secureRandom(64)).mod(N);
    gcd = r.gcd(N);
  } while (
    !gcd.equals(bigOne) ||
    r.compareTo(N) >= 0 ||
    r.compareTo(bigOne) <= 0
  );
  const blinded = messageHash.multiply(r.modPow(E, N)).mod(N);
  return {
    blinded,
    r,
  };
}

function sign({ blinded, key }) {
  const { N, D } = keyProperties(key);
  blinded = new BigInteger(blinded.toString());
  const signed = blinded.modPow(D, N);
  return signed;
}

function unblind({ signed, key, r, N }) {
  r = new BigInteger(r.toString());
  N = key ? key.keyPair.n : new BigInteger(N.toString());
  signed = new BigInteger(signed.toString());
  const unblinded = signed.multiply(r.modInverse(N)).mod(N);
  return unblinded;
}

function verify({ unblinded, key, message, E, N }) {
  unblinded = new BigInteger(unblinded.toString());
  const messageHash = messageToHashInt(message);
  N = key ? key.keyPair.n : new BigInteger(N.toString());
  E = key
    ? new BigInteger(key.keyPair.e.toString())
    : new BigInteger(E.toString());

  const originalMsg = unblinded.modPow(E, N);
  const result = messageHash.equals(originalMsg);
  return result;
}

function verify2({ unblinded, key, message }) {
  unblinded = new BigInteger(unblinded.toString());
  const messageHash = messageToHashInt(message);
  const { D, N } = keyProperties(key);
  const msgSig = messageHash.modPow(D, N);
  const result = unblinded.equals(msgSig);
  return result;
}

function verifyBlinding({ blinded, r, unblinded, key, E, N }) {
  const messageHash = messageToHashInt(unblinded);
  r = new BigInteger(r.toString());
  N = key ? key.keyPair.n : new BigInteger(N.toString());
  E = key
    ? new BigInteger(key.keyPair.e.toString())
    : new BigInteger(E.toString());

  const blindedHere = messageHash.multiply(r.modPow(E, N)).mod(N);
  const result = blindedHere.equals(blinded);
  return result;
}

function blindHEX({ message, key, N, E }) {
    const messageHash = messageToEMSA_PKCS1_v1_5Int(message);
    // N = key ? key.keyPair.n : new BigInteger(N.toString());
    // E = key
    //   ? new BigInteger(key.keyPair.e.toString())
    //   : new BigInteger(E.toString());
    N = new BigInteger(N, 16);
    // console.log(N);
    E = new BigInteger(E, 16);
    // console.log(E);
    const bigOne = new BigInteger('1');
    let gcd;
    let r;
    do {
	r = new BigInteger(secureRandom(64)).mod(N);
	gcd = r.gcd(N);
    } while (
	!gcd.equals(bigOne) ||
	    r.compareTo(N) >= 0 ||
	    r.compareTo(bigOne) <= 0
    );
    const blinded = messageHash.multiply(r.modPow(E, N)).mod(N);
    return {
	blinded,
	r,
    };
}

function signHEX({ blinded, key }) {
    const { N, D } = keyProperties(key);
    blinded = new BigInteger(blinded, 16);
    const signed = blinded.modPow(D, N);
    return signed;
}

function unblindHEX({ signed, key, r, N }) {
    N = new BigInteger(N, 16);
    signed = new BigInteger(signed, 16);
    const unblinded = signed.multiply(r.modInverse(N)).mod(N);
    return unblinded;
}

function verifyHEX({ unblinded, key, message, E, N }) {
  const messageHash = messageToHashInt(message);
    N = new BigInteger(N, 16);
    E = new BigInteger(E, 16);
    const originalMsg = unblinded.modPow(E, N);
    const result = messageHash.equals(originalMsg);
    return result;
}


module.exports = {
    keyGeneration,
    messageToHash,
    blind,
    sign,
    unblind,
    verify,
    verify2,
    verifyBlinding,
    blindHEX,
    signHEX,
    unblindHEX,
    verifyHEX
};
