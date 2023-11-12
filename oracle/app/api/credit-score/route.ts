import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// @ts-ignore
import Client from "mina-signer";
const client = new Client({ network: "testnet" });

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

function getSignedCreditScore(userId: number) {
  let privateKey = process.env.PRIVATE_KEY;
  // ??
  const knownCreditScore = (userId: number) => (userId === 1 ? 787 : 536);
  const creditScore = knownCreditScore(userId);
  const signature = client.signFields(
    [BigInt(userId), BigInt(creditScore)],
    privateKey
  );

  return {
    data: { id: userId, creditScore: creditScore },
    signature: signature.signature,
    publicKey: signature.publicKey,
  };
}

export function GET(request: NextRequest) {
  const searchParams = new URLSearchParams(request.nextUrl.search);
  return NextResponse.json(
    getSignedCreditScore(+(searchParams.get("user") ?? 0)),
    { status: 200 }
  );
}
