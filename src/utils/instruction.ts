// src/utils/instruction.ts
import * as anchor from "@coral-xyz/anchor";

import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import {
  BONUS_TOKEN_MINT,
  CREATOR_PUBLIC_KEY,
  POOL_JACKPOT_TOKEN_ACCOUNT,
  POOL_PUBLIC_KEY,
  UNDERLYING_TOKEN_MINT,
} from "./constants";
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
  decodeGambaState,
  getGambaStateAddress,
  getGameAddress,
  getPlayerAddress,
} from "gamba-core-v2";

import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";

// Initialize connection
export const connection = new Connection("https://api.mainnet-beta.solana.com");

// Initialize Provider - **wallet ONLY for cluster connection**
let wallet = new NodeWallet(new Keypair());
export const provider = new anchor.AnchorProvider(connection, wallet, {
  commitment: "processed",
});

// Initialize Gamba program
export const gambaProgram = new anchor.Program(IDL, PROGRAM_ID, provider);

/**
 * Prepare a transaction to play the game.
 *
 * @param {PublicKey} userPublicKey - The public key of the user playing the blink.
 * @param {number} amount - The amount to wager in the game.
 * @returns {Promise<{ transaction: Transaction; message: string }>} - A promise that resolves to a Solana transaction.
 */
export async function preparePlayTransaction(
  userPublicKey: PublicKey,
  amount: number
): Promise<{ transaction: Transaction; message: string }> {
  // Client seed for randomness
  const clientSeed = String(Math.random() * 1e9);

  // Wager amount in lamports (1 SOL = 1e9 lamports)
  const bnWager = amount * 1e9;

  try {
    let userUnderlyingAta;
    let creatorAta;
    let player;
    let game;
    let playerAta;
    let gambaState;
    let gambaStateAccountInfo;
    let gambaStateDecoded;
    let playInstruction;
    let transaction;

    // Check and create player account if necessary
    try {
      player = getPlayerAddress(userPublicKey);
    } catch (error) {
      // Handle error when getting player address
      const message = "Failed to get player address";
      console.error(message, error);
      throw new Error(message);
    }

    /*************************************************************
     **       Check and create game account if necessary        **
     *************************************************************/
    const playerAccountInfo = await connection.getAccountInfo(player);
    if (!playerAccountInfo) {
      // Player account not found, prepare initialization transaction
      const playerInitInstruction = await gambaProgram.methods
        .playerInitialize()
        .accounts({
          player,
          user: userPublicKey,
          systemProgram: SystemProgram.programId,
        })
        .instruction();

      const initTransaction = new Transaction().add(playerInitInstruction);
      initTransaction.feePayer = userPublicKey;
      initTransaction.recentBlockhash = (
        await connection.getLatestBlockhash()
      ).blockhash;

      const message =
        "Player account not found. Please sign this transaction to create it. Then try again.";
      console.log(message);
      return { transaction: initTransaction, message };
    }

    /*************************************************************
     **      Proceed with preparing the play transaction        **
     *************************************************************/

    // Get user's associated token address
    try {
      userUnderlyingAta = getAssociatedTokenAddressSync(
        UNDERLYING_TOKEN_MINT,
        userPublicKey
      );
    } catch (error) {
      // Handle error when getting user's associated token address
      const message = "Failed to get user's associated token address";
      console.error(message, error);
      throw new Error(message);
    }

    // Get creator's associated token address
    try {
      creatorAta = getAssociatedTokenAddressSync(
        UNDERLYING_TOKEN_MINT,
        CREATOR_PUBLIC_KEY
      );
    } catch (error) {
      // Handle error when getting creator's associated token address
      const message = "Failed to get creator's associated token address";
      console.error(message, error);
      throw new Error(message);
    }

    // Get game address
    try {
      game = getGameAddress(userPublicKey);
    } catch (error) {
      // Handle error when getting game address
      const message = "Failed to get game address";
      console.error(message, error);
      throw new Error(message);
    }

    // Get player's associated token address
    try {
      playerAta = getAssociatedTokenAddressSync(
        UNDERLYING_TOKEN_MINT,
        player,
        true
      );
    } catch (error) {
      // Handle error when getting player's associated token address
      const message = "Failed to get player's associated token address";
      console.error(message, error);
      throw new Error(message);
    }

    // Get Gamba state address
    try {
      gambaState = getGambaStateAddress();
    } catch (error) {
      // Handle error when getting Gamba state address
      const message = "Failed to get Gamba state address";
      console.error(message, error);
      throw new Error(message);
    }

    // Fetch Gamba state account info
    try {
      gambaStateAccountInfo = await connection.getAccountInfo(gambaState);
    } catch (error) {
      // Handle error when fetching Gamba state account info
      const message = "Failed to fetch Gamba state account info";
      console.error(message, error);
      throw new Error(message);
    }

    // Decode Gamba state account info
    try {
      gambaStateDecoded = decodeGambaState(gambaStateAccountInfo);
    } catch (error) {
      // Handle error when decoding Gamba state account info
      const message = "Failed to decode Gamba state account info";
      console.error(message, error);
      throw new Error(message);
    }

    // Validate decoded Gamba state
    if (!gambaStateDecoded) {
      throw new Error("Decoded Gamba state is invalid");
    }

    // Create play instruction
    try {
      playInstruction = await gambaProgram.methods
        .playGame(
          new anchor.BN(bnWager),
          [2, 0].map(basisPoints),
          clientSeed,
          basisPoints(0.05),
          basisPoints(0.01),
          "0:Blinks"
        )
        .accounts({
          user: userPublicKey,
          player,
          game,
          pool: POOL_PUBLIC_KEY,
          underlyingTokenMint: UNDERLYING_TOKEN_MINT,
          bonusTokenMint: BONUS_TOKEN_MINT,
          userUnderlyingAta,
          creator: CREATOR_PUBLIC_KEY,
          creatorAta,
          playerAta,
          playerBonusAta: PROGRAM_ID,
          userBonusAta: PROGRAM_ID,
          gambaState,
          poolJackpotTokenAccount: POOL_JACKPOT_TOKEN_ACCOUNT,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        })
        .instruction();
    } catch (error) {
      // Handle error when creating play instruction
      const message = "Failed to create play instruction";
      console.error(message, error);
      throw new Error(message);
    }

    // Create transaction and set properties
    try {
      transaction = new Transaction().add(playInstruction);
      transaction.feePayer = userPublicKey;
      transaction.recentBlockhash = (
        await connection.getLatestBlockhash()
      ).blockhash;
    } catch (error) {
      // Handle error when setting up transaction
      const message = "Failed to set up transaction";
      console.error(message, error);
      throw new Error(message);
    }

    // Success
    const message = `${amount} SOL on the line. 🚀 Blink to find out if you double up to ${
      Number(amount) * 2
    } SOL!`;
    console.log(message);
    return { transaction, message };
  } catch (error) {
    // Catch unexpected errors
    console.error("Error preparing play transaction:", error);
    throw error;
  }
}
