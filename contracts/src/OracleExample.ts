import {
  Field,
  SmartContract,
  state,
  State,
  method,
  PublicKey,
  Signature,
} from 'o1js';

// The public key of our trusted data provider
const ORACLE_PUBLIC_KEY =
  'B62qph1U5UQofXsN1gRPtJAH4GCGkaSSozUysqV7e3S8rRdcUaWyaWi';

export class OracleExample extends SmartContract {
  // Define contract state
  @state(PublicKey) oraclePublicKey = State<PublicKey>();

  // Define contract events
  events = {
    verified: Field,
  };

  init() {
    super.init();
    // Initialize contract state
    this.oraclePublicKey.set(PublicKey.fromBase58(ORACLE_PUBLIC_KEY));
    // Specify that caller should include signature with tx instead of proof
    this.requireSignature();
  }

  @method verify(id: Field, creditScore: Field, signature: Signature) {
    // Get the oracle public key from the contract state
    const oraclePublicKey = this.oraclePublicKey.get();
    this.oraclePublicKey.assertEquals(oraclePublicKey);
    // Evaluate whether the signature is valid for the provided data
    const validSignature = signature.verify(oraclePublicKey, [id, creditScore]);
    // Check that the signature is valid
    validSignature.assertTrue();
    // Check that the provided credit score is greater than 700
    creditScore.assertGreaterThanOrEqual(Field(700));
    // Emit an event containing the verified users id
    this.emitEvent('verified', id);
  }
}

/**
 * @state
 * - myBalance(voter publicKey): Number
 * - myReputation(voter publicKey): Number
 * - voteAmount(proposalId Number): Number
 * 
 * - shareVotes(voter publicKey): Number
 * - totalBalance(): Number
 * - votesYes(proposalId Number): Number
 * - votesNo(proposalId Number): Number
 * - votingPower(vp Number): Number
 * - requests(): 
 * 
 * @method
 * - deposit(amount, voter publicKey)
 * - vote(proposalId Number,(yes, no) bool, voter publicKey)
 * 
 * - requestFund(details String, amount Number)
 * -- with default deadline like 3 days
 * -- Calls oracle to update voting power with reputation
 * - closeVoting(proposalId)
 */

// oracle. get number of investments, size of investements, total return, number of investees, last investment date


/**
 * @state
 * - myBalance(voter publicKey): Number
 * - myReputation(voter publicKey): Number
 * - requestVotes(id Number): Number

 * @method
 * - deposit(amount Number, voter publicKey)
 * - vote(proposalId Number, voter publicKey)

 */
