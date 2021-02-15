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
		"name": "_data",
		"type": "address"
            },
            {
		"internalType": "bytes",
		"name": "_signature",
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
	"name": "verifyRSATest",
	"outputs": [
            {
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
            }
	],
	"stateMutability": "view",
	"type": "function"
    },
    {
	"inputs": [
            {
		"internalType": "address",
		"name": "a",
		"type": "address"
            }
	],
	"name": "toBytes",
	"outputs": [
            {
		"internalType": "bytes",
		"name": "b",
		"type": "bytes"
            }
	],
	"stateMutability": "pure",
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
		"name": "_RSAPublicKeyExponent",
		"type": "bytes"
            },
            {
		"internalType": "bytes",
		"name": "_RSAPublicKeyModulus",
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
			"name": "ca",
			"type": "address"
		    },
		    {
			"internalType": "bytes",
			"name": "patronRSAPubKeyExponent",
			"type": "bytes"
		    },
		    {
			"internalType": "bytes",
			"name": "patronRSAPubKeyModulus",
			"type": "bytes"
		    },
		    {
			"internalType": "bool",
			"name": "isValue",
			"type": "bool"
		    }
		],
		"internalType": "struct SecTor.Patron",
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
		    },
		    {
			"internalType": "bool",
			"name": "isValue",
			"type": "bool"
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
		    },
		    {
			"internalType": "bool",
			"name": "isValue",
			"type": "bool"
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
		    },
		    {
			"internalType": "bool",
			"name": "isValue",
			"type": "bool"
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
		    },
		    {
			"internalType": "bool",
			"name": "isValue",
			"type": "bool"
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
	"type": "function"
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
	"type": "function"
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
		    },
		    {
			"internalType": "bool",
			"name": "isValue",
			"type": "bool"
		    }
		],
		"internalType": "struct SecTor.Pseudonym",
		"name": "",
		"type": "tuple"
            }
	],
	"stateMutability": "view",
	"type": "function"
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
	"type": "function"
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
			"name": "ca",
			"type": "address"
		    },
		    {
			"internalType": "bytes",
			"name": "patronRSAPubKeyExponent",
			"type": "bytes"
		    },
		    {
			"internalType": "bytes",
			"name": "patronRSAPubKeyModulus",
			"type": "bytes"
		    },
		    {
			"internalType": "bool",
			"name": "isValue",
			"type": "bool"
		    }
		],
		"internalType": "struct SecTor.Patron",
		"name": "",
		"type": "tuple"
            }
	],
	"stateMutability": "view",
	"type": "function"
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
		    },
		    {
			"internalType": "bool",
			"name": "isValue",
			"type": "bool"
		    }
		],
		"internalType": "struct SecTor.Document",
		"name": "",
		"type": "tuple"
            }
	],
	"stateMutability": "view",
	"type": "function"
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
	"type": "function"
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
	"type": "function"
    }
];
