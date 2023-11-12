  import {
    Field,
    Reducer,
    SmartContract,
    State,
    Struct,
    method, state
} from 'o1js';

  export class VoteRequest extends Struct ({
    counter: Field,
    balance: Field
  }){}
  
  export class VoteRequestCounterContract extends SmartContract {
    public defaultCounterValue = Field(0);

    reducer = Reducer({ actionType: VoteRequest });

    @state(Field) public counter = State<Field>();
    @state(Field) public mutualFundId = State<Field>();

    initState(id: Field) {
        this.counter.set(this.defaultCounterValue);
        this.mutualFundId.set(id);
    }
  
    @method public increment(id: Field, by: Field, balance: Field) {
      this.mutualFundId.assertEquals(id);
      const newCounter = this.counter.get().add(by);
      const newBalance = balance.sub(by);
      this.counter.set(newCounter);
      this.reducer.dispatch({counter: newCounter, balance: newBalance});
    }
  
    @method public decrement(id: Field, by: Field, balance: Field) {
        this.mutualFundId.assertEquals(id);
        const newCounter = this.counter.get().sub(by);
        this.counter.set(newCounter);
        const newBalance = balance.add(by);
        this.reducer.dispatch({counter: newCounter, balance: newBalance});
    }

    @method public vote(id: Field, by: Field, balance: Field) {
        this.increment(id, by, balance);
    }

  }
  
  export default VoteRequestCounterContract;