import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Field, PublicKey } from "o1js";
import React, { useEffect, useState } from "react";
import "./reactCOIServiceWorker";
import ZkappWorkerClient from "./zkappWorkerClient";

let transactionFee = 0.1;

// TODO: Update the PublicKey everytime a new smart contract is deployed to the testnet
const zkappPublicKey = PublicKey.fromBase58(
  "B62qpEozJn3aH6UQgwW4VYoK7fzriQx1SAaFptEtc3AfyeB2vc65Dmf"
);
const voteAppPublicKey = PublicKey.fromBase58(
  "B62qqjc4jhRJAuAee8SpenKiB8yc1iQqu59gNAwynLZozSH5gVo97oH"
);

const requestDatas = [
  {
    id: 1,
    title: "Web3Guard",
    description:
      "Web3Guard is a startup that specializes in providing advanced security solutions for web3 applications. Our platform offers robust account abstraction services, ensuring the protection of user funds and sensitive information from potential threats. With Web3Guard, developers can confidently build and deploy decentralized applications with enhanced security measures.",
  },
  {
    id: 2,
    title: "ConnectWallet",
    description:
      "ConnectWallet is a startup that focuses on developing seamless wallet integration solutions for web3 applications. Our platform enables users to easily connect their preferred wallets to decentralized applications, streamlining the user experience and facilitating secure transactions. With ConnectWallet, developers can provide a user-friendly and accessible environment for interacting with blockchain networks.",
  },
  {
    id: 3,
    title: "ZK-Pro",
    description:
      "ZK-Pro is a startup at the forefront of zero-knowledge proof (ZKP) technology. We specialize in implementing advanced cryptographic techniques to enable privacy-preserving transactions on public blockchains. Our solutions empower users to conduct confidential and secure transactions, ensuring data integrity and privacy in decentralized systems.",
  },
  {
    id: 4,
    title: "DeFiBoost",
    description:
      "DeFiBoost is a startup dedicated to revolutionizing the decentralized finance (DeFi) industry. Our platform provides a comprehensive suite of DeFi protocols, allowing users to lend, borrow, trade, and earn interest on their digital assets in a decentralized manner. With DeFiBoost, individuals can access a wide range of financial services while maintaining full control over their funds.",
  },
  {
    id: 5,
    title: "IDLink",
    description:
      "IDLink is a startup that specializes in decentralized identity (DID) solutions. Our platform leverages blockchain technology to provide individuals with self-sovereign digital identities, enabling secure and verifiable identity management. With IDLink, users can authenticate themselves and access various online services without relying on centralized authorities, ensuring privacy and control over personal data.",
  },
  {
    id: 6,
    title: "SnarkTech",
    description:
      "SnarkTech is a startup focused on implementing zk-SNARKs technology for blockchain networks. We provide efficient and privacy-preserving transaction verification solutions, allowing for secure and scalable interactions on decentralized platforms. With SnarkTech, developers can leverage zk-SNARKs to enhance the privacy and efficiency of their blockchain applications.",
  },
  {
    id: 7,
    title: "Web3WalletX",
    description:
      "Web3WalletX is a startup that offers a feature-rich web3 wallet solution. Our platform provides users with a secure and intuitive interface to manage their digital assets, interact with decentralized applications, and participate in blockchain networks. With Web3WalletX, individuals can enjoy a seamless and user-friendly experience while maintaining full control over their cryptocurrencies.",
  },
  {
    id: 8,
    title: "OracleLink",
    description:
      "OracleLink is a startup specializing in providing reliable and secure blockchain oracle services. Our platform bridges the gap between blockchain networks and real-world data, enabling smart contracts to access and utilize off-chain information. With OracleLink, developers can leverage accurate and trustworthy data feeds for decentralized finance, supply chain management, and other blockchain-based applications.",
  },
  // Add more dummy data as needed
];

export default function Home() {
  const [state, setState] = useState({
    zkappWorkerClient: null as null | ZkappWorkerClient,
    hasWallet: null as null | boolean,
    hasBeenSetup: false,
    accountExists: false,
    currentNum: null as null | Field,
    publicKey: null as null | PublicKey,
    zkappPublicKey: null as null | PublicKey,
    voteAppPublicKey: null as null | PublicKey,
    creatingTransaction: false,
  });

  const [displayText, setDisplayText] = useState("");
  const [transactionlink, setTransactionLink] = useState("");

  // -------------------------------------------------------
  // Do Setup

  useEffect(() => {
    async function timeout(seconds: number): Promise<void> {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, seconds * 1000);
      });
    }

    //   (async () => {
    //     if (!state.hasBeenSetup) {
    //       setDisplayText("Loading web worker...");
    //       console.log("Loading web worker...");
    //       const zkappWorkerClient = new ZkappWorkerClient();
    //       await timeout(5);

    //       setDisplayText("Done loading web worker");
    //       console.log("Done loading web worker");

    //       await zkappWorkerClient.setActiveInstanceToBerkeley();

    //       const mina = (window as any).mina;

    //       if (mina == null) {
    //         setState({ ...state, hasWallet: false });
    //         return;
    //       }

    //       const publicKeyBase58: string = (await mina.requestAccounts())[0];
    //       const publicKey = PublicKey.fromBase58(publicKeyBase58);

    //       console.log(`Using key:${publicKey.toBase58()}`);
    //       setDisplayText(`Using key:${publicKey.toBase58()}`);

    //       setDisplayText("Checking if fee payer account exists...");
    //       console.log("Checking if fee payer account exists...");

    //       const res = await zkappWorkerClient.fetchAccount({
    //         publicKey: publicKey!,
    //       });
    //       const accountExists = res.error == null;

    //       await zkappWorkerClient.loadContract();

    //       console.log("Compiling zkApp...");
    //       setDisplayText("Compiling zkApp...");
    //       await zkappWorkerClient.compileContract();
    //       console.log("zkApp compiled");
    //       setDisplayText("zkApp compiled...");

    //       await zkappWorkerClient.initZkappInstance(zkappPublicKey);

    //       console.log("Getting zkApp state...");
    //       setDisplayText("Getting zkApp state...");
    //       await zkappWorkerClient.fetchAccount({ publicKey: zkappPublicKey });
    //       const currentNum = await zkappWorkerClient.getNum();
    //       console.log(`Current state in zkApp: ${currentNum.toString()}`);
    //       setDisplayText("");

    //       setState({
    //         ...state,
    //         zkappWorkerClient,
    //         hasWallet: true,
    //         hasBeenSetup: true,
    //         publicKey,
    //         zkappPublicKey,
    //         accountExists,
    //         currentNum,
    //       });
    //     }
    //   })();
    // }, []);

    // Init Custom Vote Contract
    (async () => {
      if (!state.hasBeenSetup) {
        setDisplayText("Loading web worker...");
        console.log("Loading web worker...");
        const zkappWorkerClient = new ZkappWorkerClient();
        await timeout(5);

        setDisplayText("Done loading web worker");
        console.log("Done loading web worker");

        await zkappWorkerClient.setActiveInstanceToBerkeley();

        const mina = (window as any).mina;

        if (mina == null) {
          setState({ ...state, hasWallet: false });
          return;
        }

        const publicKeyBase58: string = (await mina.requestAccounts())[0];
        const publicKey = PublicKey.fromBase58(publicKeyBase58);

        console.log(`Using key:${publicKey.toBase58()}`);
        setDisplayText(`Using key:${publicKey.toBase58()}`);

        setDisplayText("Checking if fee payer account exists...");
        console.log("Checking if fee payer account exists...");

        const res = await zkappWorkerClient.fetchAccount({
          publicKey: publicKey!,
        });
        const accountExists = res.error == null;

        await zkappWorkerClient.loadVoteContract();

        console.log("Compiling zkApp...");
        setDisplayText("Compiling zkApp...");
        await zkappWorkerClient.compileVoteContract();
        console.log("zkApp compiled");
        setDisplayText("zkApp compiled...");

        await zkappWorkerClient.initVoteInstance(zkappPublicKey);

        console.log("Getting zkApp state...");
        setDisplayText("Getting zkApp state...");
        await zkappWorkerClient.fetchAccount({ publicKey: voteAppPublicKey });
        // const currentNum = await zkappWorkerClient.getNum();
        // console.log(`Current state in zkApp: ${currentNum.toString()}`);
        setDisplayText("");

        setState({
          ...state,
          zkappWorkerClient,
          hasWallet: true,
          hasBeenSetup: true,
          publicKey,
          zkappPublicKey,
          accountExists,
        });
      }
    })();
  }, []);

  // -------------------------------------------------------
  // Wait for account to exist, if it didn't

  useEffect(() => {
    (async () => {
      if (state.hasBeenSetup && !state.accountExists) {
        for (;;) {
          setDisplayText("Checking if fee payer account exists...");
          console.log("Checking if fee payer account exists...");
          const res = await state.zkappWorkerClient!.fetchAccount({
            publicKey: state.publicKey!,
          });
          const accountExists = res.error == null;
          if (accountExists) {
            break;
          }
          await new Promise((resolve) => setTimeout(resolve, 5000));
        }
        setState({ ...state, accountExists: true });
      }
    })();
  }, [state.hasBeenSetup]);

  // -------------------------------------------------------
  // Send a transaction

  const onSendTransaction = async () => {
    setState({ ...state, creatingTransaction: true });

    setDisplayText("Creating a transaction...");
    console.log("Creating a transaction...");

    await state.zkappWorkerClient!.fetchAccount({
      publicKey: state.publicKey!,
    });

    await state.zkappWorkerClient!.createUpdateTransaction();

    setDisplayText("Creating proof...");
    console.log("Creating proof...");
    await state.zkappWorkerClient!.proveUpdateTransaction();

    console.log("Requesting send transaction...");
    setDisplayText("Requesting send transaction...");
    const transactionJSON = await state.zkappWorkerClient!.getTransactionJSON();

    setDisplayText("Getting transaction JSON...");
    console.log("Getting transaction JSON...");
    const { hash } = await (window as any).mina.sendTransaction({
      transaction: transactionJSON,
      feePayer: {
        fee: transactionFee,
        memo: "",
      },
    });

    const transactionLink = `https://berkeley.minaexplorer.com/transaction/${hash}`;
    console.log(`View transaction at ${transactionLink}`);

    setTransactionLink(transactionLink);
    setDisplayText(transactionLink);

    setState({ ...state, creatingTransaction: false });
  };

  const setReputationValue = async (amount: Field) => {
    setState({ ...state, creatingTransaction: true });

    setDisplayText("Creating a transaction...");
    console.log("Creating a transaction...");

    await state.zkappWorkerClient!.fetchAccount({
      publicKey: state.publicKey!,
    });

    await state.zkappWorkerClient!.setReputation({ amount: amount });

    setDisplayText("Creating proof...");
    console.log("Creating proof...");
    await state.zkappWorkerClient!.proveUpdateTransaction();

    console.log("Requesting send transaction...");
    setDisplayText("Requesting send transaction...");
    const transactionJSON = await state.zkappWorkerClient!.getTransactionJSON();

    setDisplayText("Getting transaction JSON...");
    console.log("Getting transaction JSON...");
    const { hash } = await (window as any).mina.sendTransaction({
      transaction: transactionJSON,
      feePayer: {
        fee: transactionFee,
        memo: "",
      },
    });

    const transactionLink = `https://berkeley.minaexplorer.com/transaction/${hash}`;
    console.log(`View transaction at ${transactionLink}`);

    setTransactionLink(transactionLink);
    setDisplayText(transactionLink);

    setState({ ...state, creatingTransaction: false });
  };

  // *****************************************************************
  // Increment
  // *****************************************************************
  const voteIncrement = async () => {
    setState({ ...state, creatingTransaction: true });

    setDisplayText("Creating a transaction...");
    console.log("Creating a transaction...");

    await state.zkappWorkerClient!.fetchAccount({
      publicKey: state.publicKey!,
    });

    await state.zkappWorkerClient!.increment();

    setDisplayText("Creating proof...");
    console.log("Creating proof...");
    await state.zkappWorkerClient!.proveUpdateTransaction();

    console.log("Requesting send transaction...");
    setDisplayText("Requesting send transaction...");
    const transactionJSON = await state.zkappWorkerClient!.getTransactionJSON();

    setDisplayText("Getting transaction JSON...");
    console.log("Getting transaction JSON...");
    const { hash } = await (window as any).mina.sendTransaction({
      transaction: transactionJSON,
      feePayer: {
        fee: transactionFee,
        memo: "",
      },
    });

    const transactionLink = `https://berkeley.minaexplorer.com/transaction/${hash}`;
    console.log(`View transaction at ${transactionLink}`);

    setTransactionLink(transactionLink);
    setDisplayText(transactionLink);

    setState({ ...state, creatingTransaction: false });
  };

  // -------------------------------------------------------
  // Refresh the current state

  const onRefreshCurrentNum = async () => {
    console.log("Getting zkApp state...");
    setDisplayText("Getting zkApp state...");

    await state.zkappWorkerClient!.fetchAccount({
      publicKey: state.zkappPublicKey!,
    });
    const currentNum = await state.zkappWorkerClient!.getNum();
    setState({ ...state, currentNum });
    console.log(`Current state in zkApp: ${currentNum.toString()}`);
    setDisplayText("");
  };

  const onRefreshCurrentReputation = async () => {
    console.log("Getting zkApp state...");
    setDisplayText("Getting zkApp state...");

    await state.zkappWorkerClient!.fetchAccount({
      publicKey: state.zkappPublicKey!,
    });
    const currentNum = await state.zkappWorkerClient!.getReputation();
    setState({ ...state, currentNum });
    console.log(`Current state in zkApp: ${currentNum.toString()}`);
    setDisplayText("");
  };

  // -------------------------------------------------------
  // Create UI elements

  let hasWallet;
  if (state.hasWallet != null && !state.hasWallet) {
    const auroLink = "https://www.aurowallet.com/";
    const auroLinkElem = (
      <a href={auroLink} target="_blank" rel="noreferrer">
        Install Auro wallet here.
      </a>
    );
    hasWallet = <div>Could not find a wallet. {auroLinkElem}</div>;
  }

  const stepDisplay = transactionlink ? (
    <a href={displayText} target="_blank" rel="noreferrer">
      View transaction
    </a>
  ) : (
    displayText
  );

  let setup = (
    <>
      {stepDisplay}
      {hasWallet}
    </>
  );

  let accountDoesNotExist;
  if (state.hasBeenSetup && !state.accountExists) {
    const faucetLink =
      "https://faucet.minaprotocol.com/?address=" + state.publicKey!.toBase58();
    accountDoesNotExist = (
      <div>
        <span style={{ paddingRight: "1rem" }}>Account does not exist.</span>
        <a href={faucetLink} target="_blank" rel="noreferrer">
          Visit the faucet to fund this fee payer account
        </a>
      </div>
    );
  }

  let mainContent;
  if (state.hasBeenSetup && state.accountExists) {
    mainContent = (
      <div style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ padding: 0 }}>
          Current state in zkApp:{" "}
          {state.currentNum ? state.currentNum.toString() : "0"}{" "}
        </div>
        <Button
          onClick={onSendTransaction}
          disabled={state.creatingTransaction}
        >
          Send Transaction
        </Button>
        <Button onClick={onRefreshCurrentNum}>Get Latest State</Button>
        <Button
          onClick={() => setReputationValue(Field(234))}
          disabled={state.creatingTransaction}
        >
          Set reputation
        </Button>
        <Button
          onClick={onRefreshCurrentReputation}
          disabled={state.creatingTransaction}
        >
          Get Latest Reputation
        </Button>
        <Button
          onClick={async () => {
            await state.zkappWorkerClient!.fetchAccount({
              publicKey: state.zkappPublicKey!,
            });
            const lastEvent: any = await state.zkappWorkerClient!.fetchEvents();
            console.log(`Current state in zkApp: ${lastEvent.toString()}`);
            setDisplayText("");
          }}
        >
          Test fetch Events
        </Button>
      </div>
    );
  }

  const CardItem = ({ item }: { item: Item }) => {
    return (
      <div className="border border-gray-300 rounded-lg p-4">
        <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
        <p className="text-gray-600 mb-4">{item.description}</p>
        <Button
          className="text-white px-4 py-2 rounded-md"
          onClick={() => voteIncrement()}
        >
          Vote
        </Button>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-orange-50 to-yellow-100">
      <Header />
      <div className="min-h-[calc(100vh-64px)] grid grid-cols-3 p-4 gap-4 rounded">
        <div className="col-span-1 bg-card p-4 border shadow-md rounded-md">
          <FirstColumn />
        </div>

        <div className="col-span-2 bg-card p-4 border shadow-md rounded-md">
          <div className="flex w-full h-24 justify-center items-center bg-card p-2 border-2 rounded-md">
            {setup}
            {accountDoesNotExist}
          </div>

          {/*  */}
          {mainContent}
          {/*  */}

          <div className="grid grid-cols-2 gap-4 pt-2">
            {requestDatas.map((item) => (
              <CardItem key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const Header = () => {
  return (
    <header className="border-b-2 text-black sticky top-0 bg-white">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <a href="#" className="text-xl font-bold">
          Privacy-Pledge
        </a>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <a href="#" className="hover:text-gray-300">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-300">
                Dashboard
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-300">
                Projects
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-300">
                Profile
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

interface Item {
  title: string;
  description: string;
}

const FirstColumn = () => {
  const [progress, setProgress] = React.useState(13);

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleDeposit = () => {
    // Logic to handle depositing balance
  };

  return (
    <div className="h-12">
      <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        Information
      </h2>
      <Progress value={progress} />
      <div>Deposited Balance</div>
      <div>Reputation</div>
      <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        Deposit fund to the pool
      </h2>
      <div className="flex items-center justify-between mt-4">
        <Input
          type="number"
          placeholder="Set Amount"
          className="border border-gray-300 rounded-md px-2 py-1 w-full"
        />
        <Button
          className=" text-white px-4 py-2 rounded-md"
          onClick={handleDeposit}
        >
          Deposit
        </Button>
      </div>
    </div>
  );
};
