import { VoteRequestCounterContract } from './VoteRequestCounterContract';
import { Field, Mina, PrivateKey, PublicKey, AccountUpdate } from 'o1js';

/*
 * This file specifies how to test the `Add` example smart contract. It is safe to delete this file and replace
 * with your own tests.
 *
 * See https://docs.minaprotocol.com/zkapps for more info.
 */

let proofsEnabled = false;

describe('Add', () => {
  let deployerAccount: PublicKey,
    deployerKey: PrivateKey,
    senderAccount: PublicKey,
    senderKey: PrivateKey,
    zkAppAddress: PublicKey,
    zkAppPrivateKey: PrivateKey,
    zkApp: VoteRequestCounterContract;

  beforeAll(async () => {
    if (proofsEnabled) await VoteRequestCounterContract.compile();
  });

  beforeEach(() => {
    const Local = Mina.LocalBlockchain({ proofsEnabled });
    Mina.setActiveInstance(Local);
    ({ privateKey: deployerKey, publicKey: deployerAccount } =
      Local.testAccounts[0]);
    ({ privateKey: senderKey, publicKey: senderAccount } =
      Local.testAccounts[1]);
    zkAppPrivateKey = PrivateKey.random();
    zkAppAddress = zkAppPrivateKey.toPublicKey();
    zkApp = new VoteRequestCounterContract(zkAppAddress);
  });

  async function localDeploy() {
    const txn = await Mina.transaction(deployerAccount, () => {
      AccountUpdate.fundNewAccount(deployerAccount);
      zkApp.deploy();
    });
    await txn.prove();
    // this tx needs .sign(), because `deploy()` adds an account update that requires signature authorization
    await txn.sign([deployerKey, zkAppPrivateKey]).send();
  }

  it('deploys the voter smart contracts', async () => {
    await localDeploy();
    const num = zkApp.counter.get();
    const id = zkApp.mutualFundId.get();
    zkApp.initState(Field(0));
    expect(num).toEqual(Field(0));
    expect(id).toEqual(Field(0));
  });

  it ('increments the counter', async () => {
    await localDeploy();
    const num = zkApp.counter.get();
    zkApp.increment(Field(0),Field(1),Field(0));
    expect(num).toEqual(Field(0));
  });

  it ('increments and decrements the counter', async () => {
    await localDeploy();
    let num = zkApp.counter.get();

    const txn = await Mina.transaction(senderAccount, () => {
      zkApp.increment(Field(0), Field(1), Field(0));
    });
    await txn.prove();
    await txn.sign([senderKey]).send();
    expect(num).toEqual(Field(0));

    // It should works
    // const events = await zkApp.reducer.getActions();
    // expect(events).toEqual(
    //   '[[{"balance": "28948022309329048855892746252171976963363056481941560715954676764349967630336", "counter": "1"}]]'
    // );

    zkApp.decrement(Field(0),Field(1),Field(0));
    num = zkApp.counter.get();
    expect(num).toEqual(Field(0));
  });
});
