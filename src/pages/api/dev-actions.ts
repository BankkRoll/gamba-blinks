//
// TODO: Make this fully independent play without the GambaProvider
// TODO: Check/Create Player using the blink account signer
//

import * as anchor from "@coral-xyz/anchor";

import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import {
  IDL,
  PROGRAM_ID,
  basisPoints,
  getPlayerAddress,
  getPoolBonusAddress,
} from "gamba-core-v2";
import { NextApiRequest, NextApiResponse } from "next";

import Cors from "cors";
import bs58 from "bs58";

export interface ActionGetResponse {
  icon: string;
  title: string;
  description: string;
  label: string;
  disabled?: boolean;
  links?: {
    actions: LinkedAction[];
  };
  error?: ActionError;
}

export interface ActionError {
  message: string;
}

export interface LinkedAction {
  href: string;
  label: string;
  parameters?: ActionParameter[];
}

export interface ActionParameter {
  name: string;
  label?: string;
  required?: boolean;
}

export interface ActionPostRequest {
  account: string;
  amount: string;
}

export interface ActionPostResponse {
  transaction: string;
  message?: string;
}

function initMiddleware(middleware: any) {
  return (req: NextApiRequest, res: NextApiResponse) =>
    new Promise((resolve, reject) => {
      middleware(req, res, (result: any) => {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve(result);
      });
    });
}

const cors = initMiddleware(
  Cors({
    methods: ["GET", "POST", "OPTIONS"],
    origin: "*",
  })
);

const connection = new Connection("https://api.mainnet-beta.solana.com");

export async function createPlayTransaction(
  connection: Connection,
  userPublicKey: PublicKey,
  wager: number,
  bet: number[],
  clientSeed: string,
  pool: PublicKey,
  underlyingTokenMint: PublicKey,
  creator: PublicKey,
  creatorFee: number,
  jackpotFee: number,
  metadata: string,
  useBonus: boolean
) {
  const provider = new anchor.AnchorProvider(
    connection,
    {}, // No wallet to pass until we have one
    { preflightCommitment: "processed" }
  );
  const program = new anchor.Program(IDL, PROGRAM_ID, provider);

  const player = getPlayerAddress(userPublicKey);

  const userUnderlyingAta = getAssociatedTokenAddressSync(
    underlyingTokenMint,
    userPublicKey
  );
  const creatorAta = getAssociatedTokenAddressSync(
    underlyingTokenMint,
    creator
  );
  const playerAta = getAssociatedTokenAddressSync(
    underlyingTokenMint,
    player,
    true
  );

  const bonusMint = getPoolBonusAddress(pool);
  const userBonusAta = getAssociatedTokenAddressSync(bonusMint, userPublicKey);
  const playerBonusAta = getAssociatedTokenAddressSync(bonusMint, player, true);

  const playInstruction = await program.methods
    .playGame(
      new anchor.BN(wager),
      bet.map(basisPoints),
      clientSeed,
      basisPoints(creatorFee),
      basisPoints(jackpotFee),
      metadata
    )
    .accounts({
      pool,
      userUnderlyingAta,
      underlyingTokenMint,
      creator,
      creatorAta,
      playerAta,
      playerBonusAta: useBonus ? playerBonusAta : null,
      userBonusAta: useBonus ? userBonusAta : null,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
    })
    .instruction();

  const transaction = new Transaction().add(playInstruction);
  transaction.feePayer = userPublicKey;
  transaction.recentBlockhash = (
    await connection.getLatestBlockhash()
  ).blockhash;

  return transaction;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await cors(req, res);

  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, Accept-Encoding"
    );
    res.status(200).end();
  } else if (req.method === "GET") {
    const { amount } = req.query;

    const actionResponse: ActionGetResponse = {
      icon: "https://gamba-blinks.vercel.app/logo.png",
      title: "Gamba Gaming Blinks",
      description: "Play Double or Nothing On-Chain With Gamba Blinks!",
      label: "Flip",
      links: {
        actions: [
          {
            label: "Play",
            href: `/api/dev-actions?amount=${encodeURIComponent(
              amount as string
            )}`,
            parameters: [
              {
                name: "amount",
                label: "Enter the amount of SOL to bet",
                required: true,
              },
            ],
          },
        ],
      },
    };

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Encoding", "compress");
    res.status(200).json(actionResponse);
  } else if (req.method === "POST" && req.url?.startsWith("/api/dev-actions")) {
    try {
      const { account } = req.body as ActionPostRequest;
      const { amount } = req.query;

      if (!amount) {
        throw new Error("Missing required query parameter: amount");
      } else if (!account) {
        throw new Error("Missing required body parameter: account");
      }

      const clientSeed = String(Math.random() * 1e9);
      const bnWager = Number(amount) * 1e9;

      const userPublicKey = new PublicKey(bs58.decode(account));
      const poolPublicKey = new PublicKey(
        "So11111111111111111111111111111111111111112"
      );
      const platformCreatorAddress = new PublicKey(
        "GzzWXXDjLD4FDwDkWB5sARjC2aaLSfCQDjx3dmpoTY7K"
      );

    //   if (!gameAccount) {
    //     const createPlayerInstruction = await gambaProvider.createPlayer();
    //     instructions.push(createPlayerInstruction);
    //   }
      
      const transaction = await createPlayTransaction(
        connection,
        userPublicKey,
        bnWager,
        [2, 0],
        clientSeed,
        poolPublicKey,
        poolPublicKey,
        platformCreatorAddress,
        0.05,
        0.01,
        "0:Flip:Solana-Blinks",
        false
      );

      const payload: ActionPostResponse = {
        transaction: transaction
          .serialize({ requireAllSignatures: false })
          .toString("base64"),
        message: `Send ${amount} SOL to play`,
      };

      res.setHeader("Access-Control-Allow-Origin", "*");
      res.status(200).json(payload);
    } catch (error: any) {
      console.error("Error processing request:", error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST", "OPTIONS"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// INCLUDE THE `OPTIONS` TO ENSURE CORS WORKS FOR BLINKS
export const OPTIONS = handler;
