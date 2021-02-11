var abi = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_patron",
          "type": "address"
        },
        {
          "internalType": "bytes",
          "name": "_RSAPublicKey",
          "type": "bytes"
        }
      ],
      "name": "createPatron",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "patron",
              "type": "address"
            },
            {
              "internalType": "bytes",
              "name": "patronRSAPubKey",
              "type": "bytes"
            },
            {
              "internalType": "bytes",
              "name": "patronBlindSignature",
              "type": "bytes"
            },
            {
              "internalType": "uint256",
              "name": "tokens",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "isPatron",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "gotInitialTokens",
              "type": "bool"
            },
            {
              "internalType": "bytes",
              "name": "publicIdentity",
              "type": "bytes"
            },
            {
              "internalType": "bytes",
              "name": "publicIdentitySignature",
              "type": "bytes"
            }
          ],
          "internalType": "struct SecTor.Pseudonym",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_patron",
          "type": "address"
        },
        {
          "internalType": "bytes",
          "name": "_patronBlindSignature",
          "type": "bytes"
        },
        {
          "internalType": "bytes",
          "name": "_exponent",
          "type": "bytes"
        },
        {
          "internalType": "bytes",
          "name": "_modulus",
          "type": "bytes"
        }
      ],
      "name": "addPseudonym",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "patron",
              "type": "address"
            },
            {
              "internalType": "bytes",
              "name": "patronRSAPubKey",
              "type": "bytes"
            },
            {
              "internalType": "bytes",
              "name": "patronBlindSignature",
              "type": "bytes"
            },
            {
              "internalType": "uint256",
              "name": "tokens",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "isPatron",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "gotInitialTokens",
              "type": "bool"
            },
            {
              "internalType": "bytes",
              "name": "publicIdentity",
              "type": "bytes"
            },
            {
              "internalType": "bytes",
              "name": "publicIdentitySignature",
              "type": "bytes"
            }
          ],
          "internalType": "struct SecTor.Pseudonym",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "grantInitialTokens",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "patron",
              "type": "address"
            },
            {
              "internalType": "bytes",
              "name": "patronRSAPubKey",
              "type": "bytes"
            },
            {
              "internalType": "bytes",
              "name": "patronBlindSignature",
              "type": "bytes"
            },
            {
              "internalType": "uint256",
              "name": "tokens",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "isPatron",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "gotInitialTokens",
              "type": "bool"
            },
            {
              "internalType": "bytes",
              "name": "publicIdentity",
              "type": "bytes"
            },
            {
              "internalType": "bytes",
              "name": "publicIdentitySignature",
              "type": "bytes"
            }
          ],
          "internalType": "struct SecTor.Pseudonym",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes",
          "name": "_hash",
          "type": "bytes"
        }
      ],
      "name": "addDocumentHash",
      "outputs": [
        {
          "components": [
            {
              "internalType": "bytes",
              "name": "hash",
              "type": "bytes"
            },
            {
              "internalType": "address",
              "name": "author",
              "type": "address"
            }
          ],
          "internalType": "struct SecTor.Document",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes",
          "name": "_publicIdentity",
          "type": "bytes"
        },
        {
          "internalType": "bytes",
          "name": "_publicIdentitySignature",
          "type": "bytes"
        },
        {
          "internalType": "bytes",
          "name": "_exponent",
          "type": "bytes"
        },
        {
          "internalType": "bytes",
          "name": "_modulus",
          "type": "bytes"
        }
      ],
      "name": "proveAuthorship",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "patron",
              "type": "address"
            },
            {
              "internalType": "bytes",
              "name": "patronRSAPubKey",
              "type": "bytes"
            },
            {
              "internalType": "bytes",
              "name": "patronBlindSignature",
              "type": "bytes"
            },
            {
              "internalType": "uint256",
              "name": "tokens",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "isPatron",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "gotInitialTokens",
              "type": "bool"
            },
            {
              "internalType": "bytes",
              "name": "publicIdentity",
              "type": "bytes"
            },
            {
              "internalType": "bytes",
              "name": "publicIdentitySignature",
              "type": "bytes"
            }
          ],
          "internalType": "struct SecTor.Pseudonym",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getCA",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "getPseudoList",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_owner",
          "type": "address"
        }
      ],
      "name": "getPseudonym",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "patron",
              "type": "address"
            },
            {
              "internalType": "bytes",
              "name": "patronRSAPubKey",
              "type": "bytes"
            },
            {
              "internalType": "bytes",
              "name": "patronBlindSignature",
              "type": "bytes"
            },
            {
              "internalType": "uint256",
              "name": "tokens",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "isPatron",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "gotInitialTokens",
              "type": "bool"
            },
            {
              "internalType": "bytes",
              "name": "publicIdentity",
              "type": "bytes"
            },
            {
              "internalType": "bytes",
              "name": "publicIdentitySignature",
              "type": "bytes"
            }
          ],
          "internalType": "struct SecTor.Pseudonym",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "getPatList",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_owner",
          "type": "address"
        }
      ],
      "name": "getPatron",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "patron",
              "type": "address"
            },
            {
              "internalType": "bytes",
              "name": "patronRSAPubKey",
              "type": "bytes"
            },
            {
              "internalType": "bytes",
              "name": "patronBlindSignature",
              "type": "bytes"
            },
            {
              "internalType": "uint256",
              "name": "tokens",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "isPatron",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "gotInitialTokens",
              "type": "bool"
            },
            {
              "internalType": "bytes",
              "name": "publicIdentity",
              "type": "bytes"
            },
            {
              "internalType": "bytes",
              "name": "publicIdentitySignature",
              "type": "bytes"
            }
          ],
          "internalType": "struct SecTor.Pseudonym",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "getDocHashes",
      "outputs": [
        {
          "internalType": "bytes[]",
          "name": "",
          "type": "bytes[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "bytes",
          "name": "_hash",
          "type": "bytes"
        }
      ],
      "name": "getDocument",
      "outputs": [
        {
          "components": [
            {
              "internalType": "bytes",
              "name": "hash",
              "type": "bytes"
            },
            {
              "internalType": "address",
              "name": "author",
              "type": "address"
            }
          ],
          "internalType": "struct SecTor.Document",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "getInitialTokenGrant",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "getDocumentUploadCost",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    }
  ];
