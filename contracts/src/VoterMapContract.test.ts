// import { MerkleMap } from "o1js";

// describe('MerkleMap', () => {
//     const zkApp;

//     beforeAll(async () => {
//         if (proofsEnabled) await MerkleMap.compile();
//     });



//     it('should pass', () => {
//         const map = new MerkleMap();

//         const rootBefore = map.getRoot();

//         const key = Field(100);

//         const witness = map.getWitness(key);
//         // update the smart contract
//         const txn1 = await Mina.transaction(deployerAccount, () => {
//         zkapp.update(
//             contract.update(
//             witness,
//             key,
//             Field(50),
//             Field(5)
//             );
//         );
//         });
//     });
// });