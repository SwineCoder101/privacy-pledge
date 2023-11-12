
import { MerkleTree, Field, PrivateKey , Mina, AccountUpdate, PublicKey} from 'o1js';
import { VoterMapContract, MerkleWitness20 } from './VoterMapContract.js';


const useProof = false;

const Local = Mina.LocalBlockchain({ proofsEnabled: useProof });
Mina.setActiveInstance(Local);
const { privateKey: deployerKey, publicKey: deployerAccount } =
  Local.testAccounts[0];
const { privateKey: senderKey, publicKey: senderAccount } =
  Local.testAccounts[1];


async function deploy(voterMapInstance : VoterMapContract, voterMapAddress : PublicKey , voterMapPrivateKey : PrivateKey, tree : MerkleTree) {
    console.log('deploying contract.....');
    const deployTxn = await Mina.transaction(deployerAccount, () => {
        AccountUpdate.fundNewAccount(deployerAccount);
        voterMapInstance.deploy();
        // get the root of the new tree to use as the initial tree root
        voterMapInstance.initState(tree.getRoot());
      });

    await deployTxn.prove();
    deployTxn.sign([deployerKey, voterMapPrivateKey]);

    const pendingDeployTx = await deployTxn.send();

    /**
 * `txn.send()` returns a pending transaction with two methods - `.wait()` and `.hash()`
 * `.hash()` returns the transaction hash
 * `.wait()` automatically resolves once the transaction has been included in a block. this is redundant for the LocalBlockchain, but very helpful for live testnets
 */
await pendingDeployTx.wait();
console.log(`deployed contract to ${voterMapAddress}`);
}

async function voterFlow(){
    return
}

async function main() {
    const voterMapPrivateKey = PrivateKey.random();
    const senderPrivateKey = PrivateKey.random();
    const voterMapAddress = voterMapPrivateKey.toPublicKey();
    const voterMapInstance = new VoterMapContract(voterMapAddress);
    await VoterMapContract.compile();

    const height = 20;
    const tree = new MerkleTree(height);

    // deploy the contract
    await deploy(voterMapInstance, voterMapAddress, voterMapPrivateKey, tree);

const incrementIndex = 522n;
const incrementAmount = Field(9);

// get the witness for the current tree
const witness = new MerkleWitness20(tree.getWitness(incrementIndex));

// update the leaf locally
tree.setLeaf(incrementIndex, incrementAmount);

// update the smart contract
const txn1 = await Mina.transaction(voterMapAddress, () => {
    voterMapInstance.update(
    witness,
    Field(0), // leafs in new trees start at a state of 0
    incrementAmount
  );
});

await txn1.prove();
const pendingTx = await txn1.sign([senderPrivateKey, voterMapPrivateKey]).send();
await pendingTx.wait();

// compare the root of the smart contract tree to our local tree
console.log(
  `BasicMerkleTree: local tree root hash after send1: ${tree.getRoot()}`
);
console.log(
  `BasicMerkleTree: smart contract root hash after send1: ${voterMapInstance.treeRoot.get()}`
);
}

main();