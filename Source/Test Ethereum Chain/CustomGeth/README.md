# What is this

This is a custom binary of geth made from a modified
version of the go-ethereum repository https://github.com/ethereum/go-ethereum

The only change is that in https://github.com/ethereum/go-ethereum/blob/master/consensus/ethash/consensus.go
the function CalcDifficulty in line 315 was changed to always return 1 instead of performing the difficulty calculation.

This causes the block difficulty to always increase by 1 with each new block.

To use this instead of the normal geth binary it must be copied to `/usr/bin`.
Confirm this with `geth version` which should show a non release version.