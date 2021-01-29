## Setup

The setup runs on a virtual server running Ubuntu Server LTS and is reachable via SSH. The IP has been omitted from the public documentation to protect the server.

On the server have been installed:
Node js, npm, truffle, ganache-cli, git, ethereum, puppeth.

To reduce the difficulty of new blocks, the difficulty calculation algorithm of ethereum has been adapted to only increase the difficulty for each new block by 1 and the genesis block is set to start difficulty by 0. For this the geth binary was recompiled after editing the go-ethereum code. The go-ethereum repository with the edited code is included in the testchain folder.
`sudo cp customGeth/geth /usr/bin` needs to be run from the testchain folder to move the custom geth binary into the system folder.

See https://hackernoon.com/how-to-reduce-block-difficulty-in-ethereum-private-testnet-2ad505609e82 for instructions on how to reproduce the edited go-ethereum code.

Successful installation of geth can be verified by running `geth version`

## Starting and controlling the test chain

To setup a new testchain, first run `sh 2020-new.sh` which will initialize a new chain based on the genesis block. Then create a new account using `sh 2020-create-account` and give it a passphrase, also be sure to copy the address.

(Usually one can just use the genesis block to allocate ether to the addresses which is omitted here, since gas prices are set to 0 and the sample account can just mine away to get ether. In order to start an address with a lot of ether, one needs to first use the create account function, insert the address in the genesis json at the bottom instead of one of the two sample addresses. Further when running 2020-new.sh it wipes the .ethereum/net2020 folder, so one needs to move the newly generated address out of that folder before running 2020-new.sh and put it back afterwards.)

Now the chain can be started by running `sh 2020-start-alone.sh` which will allow one to control the chain in console mode. One can start the miner to mine a few blocks using miner.start(1).

The startmine.js code was added (taken from here https://ethereum.stackexchange.com/questions/3151/how-to-make-miner-to-mine-only-when-there-are-pending-transactions) which ensures that only new blocks are mined if there was a recent transaction.

Further, the 2020-start-alone.sh script was modified to set gas min prices to 0. The original scrips as well as more detailed instructions on setting up an ethereum test chain can be found here https://medium.com/coinmonks/creating-and-exploring-a-private-ethereum-blockchain-using-geth-d71afc5cdcf9

## Deploying the smart contract

To deploy the contract, one needs to move first insert a valid address of the chain as the certificate authority. For this the address needs to be palced in sector contract which can be found under contracts which is under solidity in the repository. In line 138 the address needs to be pasted in, replacing the existing address of the current test setup.

Then from the solidity folder, one should execute `truffle compile` to check whether the syntax in the contract is still correct.
Afterwards one can perform the deployment using `truffle migrate --network 2020`. The blockchain needs to be running with an active miner in another console for this. After finishing the deployment, truffle will report a few things, among which is the contract address which should be noted.
In case the contract needs to be redeployed, truffle can be forced to migrate the contract again with `truffle migrate --network 2020 --reset`.

## Calling the smart contract

The ethereum test chain is exposed on port 8545 and responds to standard ethereum API calls using a web3 library.
For calling the contract, one needs the contract address and the ABI of the contract. The contract address should have been noted down from the previous step. The ABI can be found under solidity/build/contracts.

The contracts storage can be accessed, a tutorial for that is given here: https://medium.com/aigang-network/how-to-read-ethereum-contract-storage-44252c8af925

## Copyright notes

The test chain uses a modified version of go-ethereum https://github.com/ethereum/go-ethereum 
for changing the block difficulty calculation
as well as a modified version of https://github.com/adria0/SolRsaVerify
for the validation of RSA signatures.