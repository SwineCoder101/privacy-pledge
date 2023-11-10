# privacy-pledge

# Instructions

## Contracts

```sh
npm run build
```

### How to run tests

```sh
npm run test
npm run testw # watch mode
npm run test Add # test only one contract
```

### How to deploy (Do only once, delete contract keys to deploy to a new contract address)

```sh
zk deploy test3
```

### Contract Interact
Usage:
node build/src/interact.js <deployAlias>
example: node build/src/interact.js test3
(Not Working) Because the zkapp account was not found in the cache. Try calling `await fetchAccount(zkappAddress)` first.

## UI
build static
`npm run build` without type:module

deploy static github pages
`npm run deploy` with   `"type": "module",`

## Explorer

test3
https://minascan.io/berkeley/account/B62qpwCZxTVeoP1xuXGvJmgGoCoGuVTpKYfcDktoBhjxMXmQ69PbrUs/txs