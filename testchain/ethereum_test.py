from time import sleep

from web3 import Web3
import json
from Crypto.PublicKey import RSA
from Crypto.Signature import PKCS1_v1_5
from Crypto.Hash import SHA256


def getDocumentUploadCostAndInitalTokenGrant(contract):
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
    print("patron: " + patron_pseudo[1])
    print("patronRSApubkeyExponent: " + Web3.toHex(patron_pseudo[2]))
    print("patronRSApubkeyModulus: " + Web3.toHex(patron_pseudo[3]))
    print("isPatron: " + str(patron_pseudo[5]))
    print("--------------------------------------------------------------------------------------------------------------------------------------")
    return key


def addPseudonym(contract, key):
    # Sign the hashed encoded pseudonym_address with PKCS1_v1_5
    pseudonym_address_bytes = contract.caller.toBytes(pseudonym_address)

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
    print("patronBlindSignature: " + Web3.toHex(pseudo[3]))
    print("tokens: " + str(pseudo[4]))
    print("isPatron: " + str(pseudo[5]))
    print("gotInitialTokens: " + str(pseudo[6]))
    print("--------------------------------------------------------------------------------------------------------------------------------------")


def verifyRSATest(contract, key):

    data = pseudonym_address

    data_hex = data.encode().hex()

    # Sign the hashed encoded pseudonym_address with PKCS1_v1_5
    signature_bytes = PKCS1_v1_5.new(key).sign(SHA256.new(data))
    signature_hex = signature_bytes.hex()

    # Prepare the exponent e and the modulus n
    key_e_bytes = key.e.to_bytes(4, "big")
    key_n_bytes = key.n.to_bytes(256, "big")
    key_e_hex = key_e_bytes.hex()
    key_n_hex = key_n_bytes.hex()

    print("Data: " + data_hex)
    print("Signature: " + signature_hex)
    print("Exponent: " + key_e_hex)
    print("Modulus: " + key_n_hex)

    code = contract.caller.verifyRSATest(data, signature_hex, key_e_hex, key_n_hex)
    print("Code: " + str(code))
    print("--------------------------------------------------------------------------------------------------------------------------------------")


def addressToBytesTest(contract):

    response = contract.caller.toBytes(pseudonym_address)
    print(response)
    print(pseudonym_address.encode())
    print(Web3.toHex(response))
    print(pseudonym_address.encode().hex())
    print("--------------------------------------------------------------------------------------------------------------------------------------")

    print(Web3.toBytes(pseudonym_address, 32))


ca_address = "0x7B5FB9A5535f2976cdc99c57d19111B2Ed3cB925"
contract_address = "0x01f146b25aC95fbcBe73967764ce638Ea6ae9C6d"
patron_address = "0xD75d8c141b8643D25391ddbd7EF8ca3D93f70919"
pseudonym_address = "0xb8d3CAF65Fe089fFd186283a6653A44292AA7AC3"

w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:8545/"))

with open("./build/contracts/SecTor.json") as f:
	info_json = json.load(f)
abi = info_json["abi"]

# generate an RSA key for the patron
key = RSA.generate(2048)

check_address = Web3.toChecksumAddress(ca_address)

print("CA Balance: " + str(w3.eth.get_balance(check_address)))

contract = w3.eth.contract(address=contract_address, abi=abi)

# two ways of calling functions that don't require transactions
getDocumentUploadCostAndInitalTokenGrant(contract)

# verifyRSATest(contract, key)

# addressToBytesTest(contract)

# unlock CA Account using passphrase test to allow transactions
unlockAccount(ca_address, "test")

createPatron(contract, key)

# unlock pseudonym Account using passphrase test to allow transactions
unlockAccount(pseudonym_address, "test")

addPseudonym(contract, key)
