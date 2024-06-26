// pages/api/play.ts

import { NextApiRequest, NextApiResponse } from "next";
import {
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
  Keypair,
  Connection,
} from "@solana/web3.js";
import { GambaProvider, getGameAddress, getPoolAddress } from "gamba-core-v2";
import * as anchor from "@coral-xyz/anchor";

const SIDES = {
  heads: [2, 0] as const,
  tails: [0, 2] as const,
} as const;

type Side = keyof typeof SIDES;

const connection = new Connection(
  process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com",
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    try {
      const { wager, side, account } = req.body;

      if (!wager) {
        throw new Error("Missing required fields: wager");
      } else if (!account) {
        throw new Error("Missing required fields: account");
      } else if (!side) {
        throw new Error("Missing required fields: side");
      }

      const clientSeed = String(Math.random() * 1e9);
      const bnWager = wager * 0.1e9;

      if (!Object.keys(SIDES).includes(side)) {
        throw new Error(`Invalid side: ${side}`);
      }

      const userPublicKey = new PublicKey(account);
      const wallet = new anchor.Wallet(
        Keypair.fromSecretKey(userPublicKey.toBuffer()),
      );
      const gambaProvider = new GambaProvider(connection, wallet);

      // Check if user has a Gamba account
      const gamePda = getGameAddress(gambaProvider.user);
      const gameAccount =
        await gambaProvider.gambaProgram.account.game.fetchNullable(gamePda);
      let instructions = [];

      // If the user doesn't have a Gamba account, create it
      if (!gameAccount) {
        console.log("Player account not found, creating...");
        const createPlayerInstruction = await gambaProvider.createPlayer();
        instructions.push(createPlayerInstruction);
      }

      const POOL_PUBLIC_KEY = new PublicKey(
        "So11111111111111111111111111111111111111112",
      );
      const PLATFORM_CREATOR_ADDRESS = new PublicKey(
        "GzzWXXDjLD4FDwDkWB5sARjC2aaLSfCQDjx3dmpoTY7K",
      );

      // Proceed with the game play
      const playInstruction = await gambaProvider.play(
        bnWager,
        Array.from(SIDES[side as Side]),
        clientSeed,
        getPoolAddress(POOL_PUBLIC_KEY),
        POOL_PUBLIC_KEY,
        PLATFORM_CREATOR_ADDRESS,
        0.5,
        0.1,
        `0:Flip:Solana-Blinks`,
        false,
      );

      instructions.push(playInstruction);

      // Create and send transaction
      const transaction = new Transaction().add(...instructions);
      const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [wallet.payer],
      );

      res.status(200).json({ result: "Transaction successful", signature });
    } catch (error: any) {
      console.error("Error processing request:", error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
