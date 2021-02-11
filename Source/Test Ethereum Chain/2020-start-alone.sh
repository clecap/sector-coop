#!/bin/bash
nice -50 geth --datadir ~/.ethereum/net2020 --gasprice 0 --nodiscover --networkid 2020 console --maxpeers 0 --rpc --rpcport 8545 --rpcaddr "0.0.0.0" --rpccorsdomain "*" --rpcapi "eth,net,personal,debug,web3,miner" --preload "startmine.js" --allow-insecure-unlock --nousb console
