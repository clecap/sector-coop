This guide will provide step by step instructions on how to set up a test environment for running a private Ethereum chain and deploying the SecTor smart contract to it.

## Prerequisites
These instructions were written and tested for Ubuntu LTS 20.04 but could also be adapted to other Linux operating systems.
Therefore it is assumed that such a (virtual) machine is available and the reader has access to root.

## Installing software prerequisites
The following software is required: Git, Nodejs, npm, truffle, ganache-cli and Ethereum.
A custom compile of go-ethereum is used to reduce the difficulty increase per block to 1. The binary is already contained in the SecTor repository. To recompile it, a Go and a C compiler are required. See [this guide](https://hackernoon.com/how-to-reduce-block-difficulty-in-ethereum-private-testnet-2ad505609e82) for further instructions.

Run the following commands to install the required software:
```
sudo apt install git

# prepare Ethereum
sudo apt install software-properties-common
sudo add-apt-repository -y ppa:ethereum/ethereum
sudo apt update
sudo apt install ethereum

# Install Nodejs
curl -sL https://deb.nodesource.com/setup\_15.x | sudo -E bash
sudo apt install -y nodejs

sudo npm install -g truffle

# https://github.com/trufflesuite/ganache-cli
sudo npm install -g ganache-cli
```
Use 
```
geth version
```
to verify ethereum is working.

Finally download the SecTor repository
```
git clone https://github.com/clecap/sector-coop.git
cd sector-coop/
```

Move into the testchain folder
```
cd Source
cd 'Test Ethereum Chain'
```

The next step is to move the custom Geth binary into the correct folder to replace the normal one.
```
sudo cp customGeth/geth /usr/bin

geth version
```
Running geth version again should yield a slightly different result, which confirms that we are now using the custom geth version.

## Starting the chain
The next step is to start working with the chain. For this some sh scripts are already prepared. The scripts were originally taken from this [guide](https://medium.com/coinmonks/creating-and-exploring-a-private-ethereum-blockchain-using-geth-d71afc5cdcf9).
and modified to better match our use case.
The first change was setting the gasprice to 0 in 2020-start-alone.sh and the second was adding startmine.js as preload to it.
Startmine.js is a short script taken from [here](https://ethereum.stackexchange.com/questions/3151/how-to-make-miner-to-mine-only-when-there-are-pending-transactions).
it ensures that when mining new blocks, only transactions itself and up to 12 blocks after a transaction are mined instead of constantly mining blocks.
The genesis block sets the starting difficulty to 0, so blocks are produced very fast as the difficulty is also only increased by 1 thanks to the custom geth binary.

First setup at least two new accounts on the chain. For this execute
```
sh 2020-create-account.sh
```
Make sure to write down the public key address and the password somewhere.

Before initializing the chain, we need to move the keys out of the keystore as the initialization script will delete the content of the data folder.
The data folder is set to be under `~/.ethereum/net2020`
So to copy the keys somewhere save 
```
cp ~/.ethereum/net2020/keystore/* ~/Documents/
```

Now we can edit the genesis config file to give our new accounts some starting ether.
Open `2020-genesis.json` with the text editor of your choice and scroll to a section called alloc that hold addresses mapped to balances.
There should be two entries that look like this
```
"6a160606e0e4177d52e786a8622862c2891ddd7f": {
"balance": "0x200000000000000000000000000000000000000000000000000000000000000"
}
```
Replace the addresses with those from the earlier created accounts. Make sure to remove the leading `0x` here.

Now its time to initialize the chain with
```
sh 2020-new.sh
```
Afterwards move the keys back to the keystore
```
mv ~/Documents/UTC--* ~/.ethereum/net2020/keystore/
```

With that the chain can be started using 
```
sh 2020-start-alone.sh
```
This gives us a console to control the chain.
For example we can use
```
eth.blockNumber
```
to get the current block number which should be 0 for now.
To get started we want to mine some blocks, for this run
```
miner.start(1)
```
The miner first needs to do some preparations which takes a few minutes.
To stop the miner use
```
miner.stop()
```

The `2020-start-alone.sh` tells geth to preload startmin.js when starting the chain which ensures that new blocks are only mined when transactions are available. It further mines a few blocks after the transaction to ensure that the block is verified.

Further another the --gasprice 0 flag is also added in `2020-start-alone.sh` which ensures that the miner accepts 0 as gas price.

## Deploying the contract
Keep the miner running and open a new terminal.
For clarity, the terminal running the blockchain and the miner will be called terminal B (for blockchain) and the new terminal will be called terminal T (for truffle).
On terminal T navigate to the solidity folder in the repository.
```
cd sector-coop
cd Source
cd 'Solidty Smart Contract'
```

The contract uses a hard coded address as the central authority which is allowed to make other addresses to patrons.
The hard coded line in the contract needs to replaced with one of the addresses that were initialized.
Open `./contracts/SeCTor.sol` with a text editor and scroll to line 138. Or in case this was changed, it is the very first line after `contract SeCTor {` and says `address ca = <some address>`.
Replace the address with one of the initialized addresses.

***Important*** This chosen address, the `ca_address` as well as the contents of the keystore file (Stored under `~/.ethereum/net2020/keystore/UTC-****-<ca_address>`) are required for creating patrons using the User-Client. So please keep them as well.

To compile the contract run
```
truffle compile
```
To deploy the contract, truffle needs to know from which address the contract should be deployed.

Open `truffle.js` with your favorite text editor and replace the value of the from field with one of the addresses that were granted initial funds via the genesis block.

Next to deploy the contract, the account must either be unlocked or truffle must be provided with the password. Here we will just unlock the account.
In terminal B execute and provide the passphrase for that address
```
personal.unlockAccount("<address of the account>")
```
The address must be the same as the one used in the from field in truffle.js. Also omit the 0x at the beginning of the address.

Back to terminal T, run
```
truffle migrate --network 2020
```
This deploys the contracts on the chain. You should see the miner producing a few more blocks in terminal B.
After the truffle migration, terminal T shows some information for two contract deployments `Migrations` and `SecTor`. We care only about the second, the`SecTor` contract.
The output shows among other things a contract address, note down this address.

## Redeploying
After making changes the contract needs to be redeployed to the chain.
So again run in terminal T
```
truffle compile
```
until the compiler accepts your changes.
Then unlock the account again in terminal B
```
personal.unlockAccount("<address of the account>")
```
and then migrate in terminal T
```
truffle migrate --network 2020
```
However sometimes truffle claims the network is already up to date, when migrating.
To force truffle to deploy the new contract anyway use
```
truffle migrate --network 2020 --reset
```
The contract will be added again and receive a new contract address, which needs to replace the old one.

## Calling the smart contract
When the Ethereum chain is running, it exposes itself on port 8545, so opening
`localhost:8545` should give a response.
Via this port the Ethereum chain can be accessed programmatically using web3 libraries.
Follow the instructions for the web3 library in the programming language of your choice. 

In order to call upon the contract, the address of the contract as well as the ABI of the contract are required. The address was noted down, when deploying the contract, the ABI can be found under `/sector-coop/Source/Solidity Smart Contract/build/contracts/SeCTor.json`.

Have a look at the contract itself to see which functions are available. Getter functions for all storage fields are provided.

## Sample code
The file `/sector-coop/Test Ethereum Chain/ethereum_test.py` provides sample code on how to interact with each function of the contract. 

web3 and pycryptodome need to be installed via pip for ethereum_test.py to work.

Open the file with a text editor and change the ca_address, patron_address and pseudonym_address to three different valid ethereum addresses on the test chain. If necessary create additional accounts.
Further, change contract address to the address of the latest contract deployment and in the calls to unlockAccount, give the respective passphrase to each of the accounts.

Executing the python file, creates a new patron, a new pseudonym which gets verified by that patron, adds a new document for that pseudonym and finally adds a public RSA key as the identity of that pseudonym.

## Additional notes
While the miner is configured to accept 0 gas transactions and calls to the contract, truffle and any caller programmed also need to be told that they can just send 0 gas and don't need to match the estimated gas price.

The chain id is 2020.

When calling add Pseudonym a signature must be given, this signature must use RSA PKCS1 v1.5 and be based on SHA256 of an encoding of the senders address. To encode the address the same encoder must be used as the one used in the contract, for the contract provides the function toBytes(address).

## Copyright notes
The test chain uses a modified version of  [go-ethereum](https://github.com/ethereum/go-ethereum) for changing the block difficulty calculation.
A modified version of [SolRsaVerify](https://github.com/adria0/SolRsaVerify) is used for the validation of RSA signatures.
