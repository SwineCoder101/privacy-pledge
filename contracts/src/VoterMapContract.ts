import { Field, MerkleWitness, SmartContract, State, method, state, PublicKey,Poseidon } from 'o1js';

export class MerkleWitness20 extends MerkleWitness(20) {}

export class VoterMapContract extends SmartContract {

  /**
     * @state
     * - myBalance(voter publicKey): Number
     * - myReputation(voter publicKey): Number
     * - requestVotes(id Number): Number

    * @method
    * - deposit(amount Number, voter publicKey)
    * - vote(proposalId Number, voter publicKey)

    */

    @state(Field) treeRoot = State<Field>();
    
    @method initState(initialRoot: Field) {
      this.treeRoot.set(initialRoot);
    }

    // Method to add a new address to the whitelist
  @method whitelistAddress(newAddress: PublicKey, witness: MerkleWitness20) {
      const initialRoot = this.treeRoot.get();
      this.treeRoot.assertEquals(initialRoot);

      const newleaf = Poseidon.hash(newAddress.toFields());
      const newRoot = witness.calculateRoot(newleaf);
      this.treeRoot.set(newRoot);
  }

   // Method to check if an address is whitelisted
  @method isWhitelisted(addressToCheck: PublicKey, witness: MerkleWitness20) {
      const initialRoot = this.treeRoot.get();
      this.treeRoot.assertEquals(initialRoot);

      const leaf = Poseidon.hash(addressToCheck.toFields());
      witness.calculateRoot(leaf).assertEquals(initialRoot);
  }

    @method update(
      leafWitness: MerkleWitness20,
      numberBefore: Field,
      incrementAmount: Field
    ) {
      const initialRoot = this.treeRoot.get();
      this.treeRoot.assertEquals(initialRoot);
  
      incrementAmount.assertLessThan(Field(10));
  
      // check the initial state matches what we expect
      const rootBefore = leafWitness.calculateRoot(numberBefore);
      rootBefore.assertEquals(initialRoot);
  
      // compute the root after incrementing
      const rootAfter = leafWitness.calculateRoot(
        numberBefore.add(incrementAmount)
      );
  
      // set the new root
      this.treeRoot.set(rootAfter);
    }    
  }