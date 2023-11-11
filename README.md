# privacy-pledge

# Instructions

## Run Oracle

Set `.env` PRIVATE_KEY and publicKey to the oracle in contract folder

```sh
cd oracle
```

```sh
npm run dev
```

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
zk config
```

Interactive: 
- CONTRACT_NAME
- https://proxy.berkeley.minaexplorer.com/graphql or https://proxy.testworld.minaexplorer.com/graphql
- 0.1

```sh
zk deploy DEPLOY_ALIAS
```

Get the smart contract address from `keys` and update it in the `index.page.tsx`.
It takes few minutes for the address to show up.

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

# Extras

## Testing with light node

```sh
zk lightnet start --no-archive
```

https://github.com/o1-labs/zkapp-cli/pull/510
