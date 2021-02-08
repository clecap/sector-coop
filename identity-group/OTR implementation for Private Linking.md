This document explains the implementation details for OTR messaging for Private Linking and other messaging requirements of sector-coop

### Available Libraries
As of now, only one(non-audited) repository exists for javascript: [otr.js](https://www.npmjs.com/package/otr).

### Protocol specification
This library supports Version 3 and Version 2 of the [OTR protocol](https://otr.cypherpunks.ca/Protocol-v3-4.0.0.html).

### Usage
Following are the usecases of this library for sector-coop

1. Private-Linking

> You want to prove that a pseudonym and identity are linked, but you
only want to prove this to one specific party.

2. Messaging system for Blind Signatures

We need a messaging system for implementing the DSA Blind Signature handshake anyway, and I don't see an immediate downside to using this library to achieve that goal as well.