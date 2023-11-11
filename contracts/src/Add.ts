import { Field, SmartContract, state, State, method } from 'o1js';

export class Add extends SmartContract {
  @state(Field) num = State<Field>();
  @state(Field) reputation = State<Field>();

  init() {
    super.init();
    this.num.set(Field(1));
    this.reputation.set(Field(12));
  }

  @method update() {
    const currentState = this.num.getAndAssertEquals();
    const newState = currentState.add(2);
    this.num.set(newState);
  }

  @method setReputation(reputation: Field) {
    this.reputation.set(reputation);
  }
}
