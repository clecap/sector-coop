"""
This file demonstrates how to call each function on the SecTor.sol smart contract.
Make sure to replace either the contract address or the pseudonym and patron address as well as make up a new document
after each run, as each patron address, pseudonym address and document hash may only be once on the contract.

:author: Jonathan Decker
"""

from time import sleep

from web3 import Web3
import json
from Crypto.PublicKey import RSA
from Crypto.Signature import PKCS1_v1_5
from Crypto.Hash import SHA256


def getDocumentUploadCostAndInitalTokenGrant(contract):
    # two ways of calling functions that don't require transactions
    print("Document upload cost: " + str(contract.caller.getDocumentUploadCost()))
    print("Initial token grant: " + str(contract.functions.getInitialTokenGrant().call()))
    print("--------------------------------------------------------------------------------------------------------------------------------------")


def unlockAccount(address, password):
    w3.parity.personal.unlockAccount(address, password)


def createPatron(contract, key):

    # Prepare the exponent e and the modulus n
    key_e_bytes = key.e.to_bytes(4, "big")
    key_n_bytes = key.n.to_bytes(256, "big")
    key_e_hex = key_e_bytes.hex()
    key_n_hex = key_n_bytes.hex()
    print("Exponent:")
    print(key_e_bytes)
    print(key_e_hex)
    print("Modulus:")
    print(key_n_bytes)
    print(key_n_hex)
    print("--------------------------------------------------------------------------------------------------------------------------------------")

    # add the patron
    response = contract.functions.createPatron(patron_address, key_e_hex, key_n_hex).transact({"from": ca_address})

    print("Create Patron Transaction: " + Web3.toJSON(response))

    # wait for the miner to add the transaction
    sleep(10)

    print("List of patron addresses: " + str(contract.caller.getPatList()))
    patron_pseudo = contract.caller.getPatron(patron_address)

    print("owner: " + patron_pseudo[0])
    print("CA: " + patron_pseudo[1])
    print("patronRSApubkeyExponent: " + Web3.toHex(patron_pseudo[2]))
    print("patronRSApubkeyModulus: " + Web3.toHex(patron_pseudo[3]))
    print("--------------------------------------------------------------------------------------------------------------------------------------")
    return key


def addPseudonym(contract, key):
    # Solidity does encoding somewhat different with the abi.encodePacked(data) function, so for now we also use it
    # The toBytes function does the same as abi.encodePacked
    pseudonym_address_bytes = contract.caller.toBytes(pseudonym_address)
    # Sign the hashed encoded pseudonym_address with PKCS1_v1_5
    signature_bytes = PKCS1_v1_5.new(key).sign(SHA256.new(pseudonym_address_bytes))
    signature_hex = signature_bytes.hex()

    print("Signature:")
    print(signature_bytes)
    print(signature_hex)
    print("--------------------------------------------------------------------------------------------------------------------------------------")

    # Prepare the exponent e and the modulus n
    key_e_bytes = key.e.to_bytes(4, "big")
    key_n_bytes = key.n.to_bytes(256, "big")
    key_e_hex = key_e_bytes.hex()
    key_n_hex = key_n_bytes.hex()

    # Rebuild the RSA key from the extracted e and n and verify the signature
    constructed_key = RSA.construct((int.from_bytes(key_n_bytes, "big"), int.from_bytes(key_e_bytes, "big")))
    print("Verify signature: " + str(
        PKCS1_v1_5.new(constructed_key).verify(SHA256.new(pseudonym_address_bytes), signature_bytes)))
    constructed_key = RSA.construct((int.from_bytes(bytes.fromhex(key_n_hex), "big"), int.from_bytes(bytes.fromhex(key_e_hex), "big")))
    print("Verify signature: " + str(
        PKCS1_v1_5.new(constructed_key).verify(SHA256.new(pseudonym_address_bytes), signature_bytes)))
    print("--------------------------------------------------------------------------------------------------------------------------------------")

    response = contract.functions.addPseudonym(patron_address, signature_hex).transact(
        {"from": pseudonym_address})

    print("addPseudonym transaction: " + str(Web3.toJSON(response)))

    # wait for the miner to add the transaction
    sleep(10)

    print("List of Pseudonym transactions: " + str(contract.caller.getPseudoList()))
    pseudo = contract.caller.getPseudonym(pseudonym_address)

    print("owner: " + pseudo[0])
    print("patron: " + pseudo[1])
    print("patronBlindSignature: " + Web3.toHex(pseudo[2]))
    print("tokens: " + str(pseudo[3]))
    print("gotInitialTokens: " + str(pseudo[4]))
    print("--------------------------------------------------------------------------------------------------------------------------------------")


def grantInitialTokens(contract):
    response = contract.functions.grantInitialTokens().transact({"from": pseudonym_address})

    print("grantInitialTokens transaction: " + str(Web3.toJSON(response)))

    # wait for the miner to add the transaction
    sleep(10)

    pseudo = contract.caller.getPseudonym(pseudonym_address)

    print("owner: " + pseudo[0])
    print("patron: " + pseudo[1])
    print("patronBlindSignature: " + Web3.toHex(pseudo[2]))
    print("tokens: " + str(pseudo[3]))
    print("gotInitialTokens: " + str(pseudo[4]))
    print("--------------------------------------------------------------------------------------------------------------------------------------")


def proveAuthorship(contract):
    identity_key = RSA.generate(2048)

    # The toBytes function does the same as abi.encodePacked
    pseudonym_address_bytes = contract.caller.toBytes(pseudonym_address)
    # Sign the hashed encoded pseudonym_address with PKCS1_v1_5
    signature_bytes = PKCS1_v1_5.new(identity_key).sign(SHA256.new(pseudonym_address_bytes))
    signature_hex = signature_bytes.hex()

    # Prepare the exponent e and the modulus n
    key_e_bytes = identity_key.e.to_bytes(4, "big")
    key_n_bytes = identity_key.n.to_bytes(256, "big")
    key_e_hex = key_e_bytes.hex()
    key_n_hex = key_n_bytes.hex()

    response = contract.functions.proveAuthorship(identity_key.publickey().export_key().hex(), signature_hex, key_e_hex, key_n_hex).transact({"from": pseudonym_address})

    print("proveAuthorship transaction: " + str(Web3.toJSON(response)))

    # wait for the miner to add the transaction
    sleep(10)

    pseudo = contract.caller.getPseudonym(pseudonym_address)

    print("owner: " + pseudo[0])
    print("patron: " + pseudo[1])
    print("patronBlindSignature: " + Web3.toHex(pseudo[2]))
    print("tokens: " + str(pseudo[3]))
    print("gotInitialTokens: " + str(pseudo[4]))
    print("publicIdentity: " + str(Web3.toHex(pseudo[5])))
    print("publicIdentitySignature " + str(Web3.toHex(pseudo[6])))
    print("--------------------------------------------------------------------------------------------------------------------------------------")


def addDocumentHash(contract, document):

    document_enc = document.encode()
    document_hash = SHA256.new(document_enc).digest()

    response = contract.functions.addDocumentHash(document_hash).transact({"from": pseudonym_address})

    print("addDocumentHash transaction: " + str(Web3.toJSON(response)))

    # wait for the miner to add the transaction
    sleep(10)

    print("List of Doc Hashes: " + str([Web3.toHex(h) for h in contract.caller.getDocHashes()]))

    doc = contract.caller.getDocument(document_hash)

    print("hash: " + str(Web3.toHex(doc[0])))
    print("author: " + doc[1])


def verifyRSATest(contract, key):
    # This function demonstrates how the RSA signature validation works by calling verifyRSATest which directly forwards
    # the inputs to the library that does the validation.
    data_bytes = contract.caller.toBytes(pseudonym_address)

    # Sign the hashed encoded pseudonym_address with PKCS1_v1_5
    signature_bytes = PKCS1_v1_5.new(key).sign(SHA256.new(data_bytes))
    signature_hex = signature_bytes.hex()

    # Prepare the exponent e and the modulus n
    key_e_bytes = key.e.to_bytes(4, "big")
    key_n_bytes = key.n.to_bytes(256, "big")
    key_e_hex = key_e_bytes.hex()
    key_n_hex = key_n_bytes.hex()

    print("Data: " + data_bytes.hex())
    print("Signature: " + signature_hex)
    print("Exponent: " + key_e_hex)
    print("Modulus: " + key_n_hex)

    code = contract.caller.verifyRSATest(data_bytes, signature_hex, key_e_hex, key_n_hex)
    print("Code: " + str(code))
    print("--------------------------------------------------------------------------------------------------------------------------------------")


def addressToBytesTest(contract):
    # This function demonstrates the difference between the toBytes function and the encode

    response = contract.caller.toBytes(pseudonym_address)
    print(response)
    print(pseudonym_address.encode())
    print(Web3.toHex(response))
    print(pseudonym_address.encode().hex())
    print("--------------------------------------------------------------------------------------------------------------------------------------")


ca_address = "0x7B5FB9A5535f2976cdc99c57d19111B2Ed3cB925"
contract_address = "0xeABB62E71a36a9A3eD54c49e0aBAA3b786e55F99"
patron_address = "0xD75d8c141b8643D25391ddbd7EF8ca3D93f70919"
pseudonym_address = "0xb8d3CAF65Fe089fFd186283a6653A44292AA7AC3"
document = "I am a document."

w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:8545/"))

with open("./build/contracts/SecTor.json") as f:
    info_json = json.load(f)
abi = info_json["abi"]

# generate an RSA key for the patron
key = RSA.generate(2048)

check_address = Web3.toChecksumAddress(ca_address)

print("CA Balance: " + str(w3.eth.get_balance(check_address)))

contract = w3.eth.contract(address=contract_address, abi=abi)

getDocumentUploadCostAndInitalTokenGrant(contract)

verifyRSATest(contract, key)

addressToBytesTest(contract)

# unlock CA Account using passphrase test to allow transactions
unlockAccount(ca_address, "test")

createPatron(contract, key)

# unlock pseudonym Account using passphrase test to allow transactions
unlockAccount(pseudonym_address, "test")

addPseudonym(contract, key)

grantInitialTokens(contract)

addDocumentHash(contract, document)

proveAuthorship(contract)
