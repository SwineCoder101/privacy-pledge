import { Field, Mina, PublicKey, fetchAccount } from "o1js";

type Transaction = Awaited<ReturnType<typeof Mina.transaction>>;

// ---------------------------------------------------------------------------------------

import type { Add } from "../../../contracts/src/Add";
import type { VoteRequestCounterContract } from "../../../contracts/src/VoteRequestCounterContract";

const state = {
  Add: null as null | typeof Add,
  zkapp: null as null | Add,
  transaction: null as null | Transaction,
  // My Voting Contract
  VoteRequestCounterContract: null as null | typeof VoteRequestCounterContract,
  voteApp: null as null | VoteRequestCounterContract,
};

// ---------------------------------------------------------------------------------------

const functions = {
  setActiveInstanceToBerkeley: async (args: {}) => {
    const Berkeley = Mina.Network({
      mina: "https://proxy.berkeley.minaexplorer.com/graphql", // Use https://proxy.berkeley.minaexplorer.com/graphql or https://api.minascan.io/node/berkeley/v1/graphql
      archive: "https://api.minascan.io/archive/berkeley/v1/graphql/", // Use or https://archive.berkeley.minaexplorer.com/
    });
    console.log("Berkeley Instance Created");
    Mina.setActiveInstance(Berkeley);
  },
  loadContract: async (args: {}) => {
    const { Add } = await import("../../../contracts/build/src/Add");
    state.Add = Add;
  },
  compileContract: async (args: {}) => {
    await state.Add!.compile();
  },
  fetchAccount: async (args: { publicKey58: string }) => {
    const publicKey = PublicKey.fromBase58(args.publicKey58);
    return await fetchAccount({ publicKey });
  },
  initZkappInstance: async (args: { publicKey58: string }) => {
    const publicKey = PublicKey.fromBase58(args.publicKey58);
    state.zkapp = new state.Add!(publicKey);
  },

  // 4 func to call for my Voting Contract
  // we load and compile the cnotract.Then we assign it with the pub key to the zk app
  loadVoteContract: async (args: {}) => {
    const { VoteRequestCounterContract } = await import(
      "../../../contracts/build/src/VoteRequestCounterContract"
    );
    state.VoteRequestCounterContract = VoteRequestCounterContract;
  },
  compileVoteContract: async (args: {}) => {
    await state.VoteRequestCounterContract!.compile();
  },
  // fetch can apply above one
  initVoteInstance: async (args: { publicKey58: string }) => {
    const publicKey = PublicKey.fromBase58(args.publicKey58);
    state.voteApp = new state.VoteRequestCounterContract!(publicKey);
  },

  // Start of Custom Calls
  getNum: async (args: {}) => {
    const currentNum = await state.zkapp!.num.get();
    return JSON.stringify(currentNum.toJSON());
  },
  getReputation: async (args: {}) => {
    const currentNum = await state.zkapp!.reputation.get();
    return JSON.stringify(currentNum.toJSON());
  },
  createUpdateTransaction: async (args: {}) => {
    const transaction = await Mina.transaction(() => {
      state.zkapp!.update();
    });
    state.transaction = transaction;
  },
  setReputation: async (args: { amount: Field }) => {
    const transaction = await Mina.transaction(() => {
      state.zkapp!.setReputation(Field(12));
    });
    state.transaction = transaction;
  },

  // Methods for my Vote Contract
  fetchEvents: async () => {
    const events = await state.voteApp!.fetchEvents();
    return JSON.stringify(events[0].event);
  },

  // End of Custom Calls

  proveUpdateTransaction: async (args: {}) => {
    await state.transaction!.prove();
  },
  getTransactionJSON: async (args: {}) => {
    return state.transaction!.toJSON();
  },
};

// ---------------------------------------------------------------------------------------

export type WorkerFunctions = keyof typeof functions;

export type ZkappWorkerRequest = {
  id: number;
  fn: WorkerFunctions;
  args: any;
};

export type ZkappWorkerReponse = {
  id: number;
  data: any;
};

if (typeof window !== "undefined") {
  addEventListener(
    "message",
    async (event: MessageEvent<ZkappWorkerRequest>) => {
      const returnData = await functions[event.data.fn](event.data.args);

      const message: ZkappWorkerReponse = {
        id: event.data.id,
        data: returnData,
      };
      postMessage(message);
    }
  );
}

console.log("Web Worker Successfully Initialized.");
