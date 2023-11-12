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
npm run test VoteRequestCounterContract # test only one contract
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

# Troubleshoots

Couldn't send zkApp command: (invalid ("No verification key found for proved account update" (account_id (ACCOUNT_ID 0x...))))

> Probably the wallet is connected to the wrong network


### Issues:

getActions: fromActionState not found.

```rust
    const events = await zkApp.reducer.getActions({
      fromActionState: Field(0),
      endActionState: Field(100000000),
    });
```

TypeError: x.isConstant is not a function

```rust

```rust
events = {
    'add-merkle-leaf': Field,
    'update-merkle-leaf': Field,
  };
```

this.emitEvent('update-merkle-leaf', '234');

solution:

```
    const txn = await Mina.transaction(senderAccount, () => {
      zkApp.increment(Field(0), Field(1), Field(0));
    });
    await txn.prove();
    await txn.sign([senderKey]).send();

    const events = await zkApp.reducer.getActions();
    expect(events).toEqual('hello world');
```


```
# Tips

For development on Testnet. Can check current zkApp states directly on the explorer