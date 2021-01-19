pragma solidity ^0.6.0;

//import {SolRsaVerify} from './SolRsaVerify.sol';

library SolRsaVerify {

    function memcpy(uint _dest, uint _src, uint _len) pure internal {
        // Copy word-length chunks while possible
        for ( ;_len >= 32; _len -= 32) {
            assembly {
                mstore(_dest, mload(_src))
            }
            _dest += 32;
            _src += 32;
        }

        // Copy remaining bytes
        uint mask = 256 ** (32 - _len) - 1;
        assembly {
            let srcpart := and(mload(_src), not(mask))
            let destpart := and(mload(_dest), mask)
            mstore(_dest, or(destpart, srcpart))
        }
    }


    function join(
	bytes memory _s, bytes memory _e, bytes memory _m
    ) pure internal returns (bytes memory) {
        uint inputLen = 0x60+_s.length+_e.length+_m.length;

        uint slen = _s.length;
        uint elen = _e.length;
        uint mlen = _m.length;
        uint sptr;
        uint eptr;
        uint mptr;
        uint inputPtr;

        bytes memory input = new bytes(inputLen);
        assembly {
            sptr := add(_s,0x20)
            eptr := add(_e,0x20)
            mptr := add(_m,0x20)
            mstore(add(input,0x20),slen)
            mstore(add(input,0x40),elen)
            mstore(add(input,0x60),mlen)
            inputPtr := add(input,0x20)
        }
        memcpy(inputPtr+0x60,sptr,_s.length);
        memcpy(inputPtr+0x60+_s.length,eptr,_e.length);
        memcpy(inputPtr+0x60+_s.length+_e.length,mptr,_m.length);

        return input;
    }

    /** @dev Verifies a PKCSv1.5 SHA256 signature
      * @param _sha256 is the sha256 of the data
      * @param _s is the signature
      * @param _e is the exponent
      * @param _m is the modulus
      * @return 0 if success, >0 otherwise
    */
    function pkcs1Sha256Verify(
        bytes32 _sha256,
        bytes memory _s, bytes memory _e, bytes memory _m
    ) internal view returns (uint) {

        uint8[19] memory sha256Prefix = [
            0x30, 0x31, 0x30, 0x0d, 0x06, 0x09, 0x60, 0x86, 0x48, 0x01, 0x65, 0x03, 0x04, 0x02, 0x01, 0x05, 0x00, 0x04, 0x20
        ];

      	require(_m.length >= sha256Prefix.length+_sha256.length+11);

        uint i;

        /// decipher
        bytes memory input = join(_s,_e,_m);
        uint inputlen = input.length;

        uint decipherlen = _m.length;
        bytes memory decipher = new bytes(decipherlen);
        assembly {
            pop(staticcall(sub(gas(), 2000), 5, add(input,0x20), inputlen, add(decipher,0x20), decipherlen))
	}

        /// 0x00 || 0x01 || PS || 0x00 || DigestInfo
        /// PS is padding filled with 0xff
        //  DigestInfo ::= SEQUENCE {
        //     digestAlgorithm AlgorithmIdentifier,
        //     digest OCTET STRING
        //  }

        uint paddingLen = decipherlen - 3 - sha256Prefix.length - 32;

        if (decipher[0] != 0 || uint8(decipher[1]) != 1) {
            return 1;
        }
        for (i = 2;i<2+paddingLen;i++) {
            if (decipher[i] != 0xff) {
                return 2;
            }
        }
        if (decipher[2+paddingLen] != 0) {
            return 3;
        }
        for (i = 0;i<sha256Prefix.length;i++) {
            if (uint8(decipher[3+paddingLen+i])!=sha256Prefix[i]) {
                return 4;
            }
        }
        for (i = 0;i<_sha256.length;i++) {
            if (decipher[3+paddingLen+sha256Prefix.length+i]!=_sha256[i]) {
                return 5;
            }
        }

        return 0;
    }

    /** @dev Verifies a PKCSv1.5 SHA256 signature
      * @param _data to verify
      * @param _s is the signature
      * @param _e is the exponent
      * @param _m is the modulus
      * @return 0 if success, >0 otherwise
    */
    function pkcs1Sha256VerifyRaw(
        bytes memory _data,
        bytes memory _s, bytes memory _e, bytes memory _m
    ) internal view returns (uint) {
        return pkcs1Sha256Verify(sha256(_data),_s,_e,_m);
    }

}

contract SecTor {
    address ca; // Hardcoded address of the central authority
    mapping(address => Pseudonym) pseudonyms;
    mapping(address => Pseudonym) patrons;
    mapping(address => mapping(bytes => Document)) docs;
    uint initialTokenGrant = 10; // The number of initially granted tokens
    uint documentUploadCost = 2;

    /*
    This assumes that we only use one instance of this contract.
    */

    constructor() public{
        initialTokenGrant = 10; // The number of initially granted tokens
        documentUploadCost = 2;
        ca = 0x6a160606e0E4177d52E786a8622862C2891ddD7F;
    }

    struct Pseudonym {
        address owner;
        address patron;
        bytes patronRSAPubKey;
        bytes patronBlindSignature;
        uint tokens;

        bool isPatron;
        bool gotInitialTokens;

        bytes publicIdentity;
        bytes publicIdentitySignature;
    }

    struct Document {
        bytes hash;
        // bool accepted;
    }

    modifier caOnly() {
        require(
            msg.sender == ca,
            "This function is restricted to the central authority."
        );
        _;
    }

    function createPatron(address _patron, bytes memory _RSAPublicKey) public caOnly returns (bool){

        // Create new patron
        Pseudonym memory patron = Pseudonym({
            owner: _patron,
            patronRSAPubKey: _RSAPublicKey,
            patron: ca,
            patronBlindSignature: "",
            tokens: 0,
            isPatron: true,
            gotInitialTokens: true, // to disable patrons from getting tokens to publish documents
            publicIdentity: "",
            publicIdentitySignature: ""
            });
        patrons[_patron] = patron;

        return true;
    }

    function addPseudonym(address _patron, bytes memory _patronBlindSignature, bytes memory _exponent, bytes memory _modulus) public returns (bool){
        // Validate blind Signature of Patron
        Pseudonym storage patron = patrons[_patron];
        require(patron.isPatron != true, "Given address must be a patron.");
        // Use RSA library here, signature should have been unblinded already
        require(SolRsaVerify.pkcs1Sha256VerifyRaw(abi.encodePacked(msg.sender), _patronBlindSignature, _exponent, _modulus) == 0, "Signature does not match sender address.");

        // Create new Pseudonym
        Pseudonym memory pseudo = Pseudonym({
            owner: msg.sender,
            patronRSAPubKey: "",
            patron: _patron,
            patronBlindSignature: _patronBlindSignature,
            tokens: 0,
            isPatron: false,
            gotInitialTokens: false,
            publicIdentity: "",
            publicIdentitySignature: ""
            });
        pseudonyms[msg.sender] = pseudo;

        return true;
    }

    function grantInitialTokens() public returns (bool){
        Pseudonym memory pseudo = pseudonyms[msg.sender];

        // Check if tokens were already granted
        require(pseudo.gotInitialTokens == true, "This pseudonym already received initial tokens.");

        // Update pseudonym
        pseudo.tokens = initialTokenGrant;
        pseudo.gotInitialTokens = true;
        pseudonyms[msg.sender] = pseudo;

        return true;
    }

    function addDocumentHash(bytes memory _hash) public returns (bool){
        Pseudonym memory pseudo = pseudonyms[msg.sender];

        // Check if enough tokens are available
        require(pseudo.tokens < documentUploadCost, "This pseudonym does not have enough tokens to pay the upload cost.");

        // pay the tokens
        pseudo.tokens = pseudo.tokens - documentUploadCost;

        // add the document hash
        Document memory doc = Document({
            hash: _hash
            });
        docs[msg.sender][_hash] = doc;
        pseudonyms[msg.sender] = pseudo;

        return true;
    }

    function proveAuthorship(bytes memory _publicIdentity, bytes memory _publicIdentitySignature, bytes memory _exponent, bytes memory _modulus) public returns (bool){
        Pseudonym memory pseudo = pseudonyms[msg.sender];
        // Validate _publicIdentitySignature signature of the ethereum address aka msg.sender
        require(SolRsaVerify.pkcs1Sha256VerifyRaw(abi.encodePacked(msg.sender), _publicIdentitySignature, _exponent, _modulus) == 0, "Signature does not match sender address.");

        // update pseudonym
        pseudo.publicIdentity = _publicIdentity;
        pseudo.publicIdentitySignature = _publicIdentitySignature;
        pseudonyms[msg.sender] = pseudo;

        return true;
    }
}
