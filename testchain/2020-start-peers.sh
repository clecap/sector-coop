#!/bin/bash
nice -50 geth --datadir ~/.ethereum/net2020 --gasprice 0 --networkid 2020 console --rpc --rpcport 8545 --rpcaddr "0.0.0.0" --rpccorsdomain "*" --rpcapi "eth,net,personal,debug" --allow-insecure-unlock --nousb console
