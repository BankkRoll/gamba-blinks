// src/pages/api/actions.ts

import { Connection, Keypair, PublicKey, Transaction } from "@solana/web3.js";
import { GambaProvider, getGameAddress, getPoolAddress } from "gamba-core-v2";
import type { NextApiRequest, NextApiResponse } from "next";

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
            href: `/api/actions?amount=${encodeURIComponent(amount as string)}`,
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
  } else if (req.method === "POST" && req.url?.startsWith("/api/actions")) {
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

      /**************************************************************************
       *                                                                        *
       *                          W A R N I N G   F L A G                       *
       *                                                                        *
       **************************************************************************/
      
      const wallet = "xxxxxxxxxxxxxx................xxxxxxxxxxxxxxxx";
      const keypair = Keypair.fromSecretKey(bs58.decode(wallet));

      /**************************************************************************
       *                                                                        *
       *    TODO: Use user's wallet correctly BY REMOVING THE GAMBAPROVIDER     *
       *              WARNING: Currently works if you pass a keypair            *
       *                                                                        *
       **************************************************************************/
      
      const gambaProvider = new GambaProvider(connection, keypair, {
        skipPreflight: true,
        preflightCommitment: "processed",
        commitment: "processed",
      });

      const gamePda = getGameAddress(gambaProvider.user);
      const gameAccount =
        await gambaProvider.gambaProgram.account.game.fetchNullable(gamePda);
      let instructions = [];

      if (!gameAccount) {
        const createPlayerInstruction = await gambaProvider.createPlayer();
        instructions.push(createPlayerInstruction);
      }

      const playInstruction = await gambaProvider.play(
        bnWager,
        [2, 0],
        clientSeed,
        getPoolAddress(poolPublicKey),
        poolPublicKey,
        platformCreatorAddress,
        0.05,
        0.01,
        "0:Flip:Solana-Blinks",
        false
      );

      instructions.push(playInstruction);

      const transaction = new Transaction().add(...instructions);
      transaction.feePayer = userPublicKey;
      transaction.recentBlockhash = (
        await connection.getLatestBlockhash()
      ).blockhash;

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
