# BlindSignatures

This project uses a modified version of
[blind-signatures](https://github.com/kevinejohn/blind-signatures/blob/master/rsablind.js).

The following functions have been added to `rsablind.js`:

	`messageToEMSA_PKCS1_v1_5`
	`messageToEMSA_PKCS1_v1_5Int`
	`blindHEX`
	`signHEX`
    `unblindHEX`
    `verifyHEX`

The first two function allow for the blind signatures hence generated
using this library to follow the padding standard specified by
PKCS1-v1.5. The resulting signatures are standard PKCS1-v1.5
signatures.
