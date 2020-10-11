
# Calculator to calculate tezos smart contract gas fee
### Examples of use, Estimate a transfer operation :
### Assuming that provider and signer are already configured...
```
const amount = 2;
const address = 'tz1h3rQ8wBxFd8L9B3d7Jhaawu6Z568XU3xY';

// Estimate gasLimit, storageLimit and fees for a transfer operation
const est = await Tezos.estimate.transfer({ to: address, amount: amount })
console.log(est.burnFeeMutez, est.gasLimit, est.minimalFeeMutez, est.storageLimit,
est.suggestedFeeMutez, est.totalCost, est.usingBaseFeeMutez)
```

### Estimate a contract origination :

```
const est = await Tezos.estimate.originate({
code: michelsonCode,
storage: {
    stored_counter: 0,
    threshold: 1,
    keys: ['edpkuLxx9PQD8fZ45eUzrK3BhfDZJHhBuK4Zi49DcEGANwd2rpX82t']
}
})
console.log(est.burnFeeMutez, est.gasLimit, est.minimalFeeMutez, est.storageLimit,
est.suggestedFeeMutez, est.totalCost, est.usingBaseFeeMutez)
```
