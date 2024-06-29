// src/pages/api/play-gamba.ts
import {
  ActionGetResponse,
  ActionPostRequest,
  ActionPostResponse,
} from "@/utils/types";
import { NextApiRequest, NextApiResponse } from "next";

import Cors from "cors";
import { PublicKey } from "@solana/web3.js";
import bs58 from "bs58";
import { preparePlayTransaction } from "@/utils/instruction";

// CORS Middleware
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

// Apply CORS
const cors = initMiddleware(
  Cors({
    methods: ["GET", "POST", "OPTIONS"],
    origin: "*",
  })
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await cors(req, res); // Apply CORS

  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, Accept-Encoding"
    );
    res.status(200).end();
  } else if (req.method === "GET") {
    // Handle GET requests to return metadata
    const { amount } = req.query;

    const actionResponse: ActionGetResponse = {
      icon: "https://gamba-blinks.vercel.app/logo.png",
      title: "Gamba Blinks",
      description:
        "Experience on-chain degeneracy with Gamba Blinks! Participate in the decentralized gambleFi protocol on Solana for a chance to double your SOL.",
      label: "Flip",
      links: {
        actions: [
          {
            label: "Play",
            href: encodeURI(`/api/play-gamba?amount=${encodeURIComponent(amount as string)}`)
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
  } else if (req.method === "POST" && req.url?.startsWith("/api/play-gamba")) {
    try {
      // Parse request body and query parameters
      const { account } = req.body as ActionPostRequest;
      const { amount } = req.query;

      if (!amount) {
        res
          .status(400)
          .json({ error: "Missing required query parameter: amount" });
        return;
      } else if (!account) {
        res
          .status(400)
          .json({ error: "Missing required body parameter: account" });
        return;
      }

      // Decode account
      const userPublicKey = new PublicKey(bs58.decode(account));
      console.log("userPublicKey", userPublicKey.toBase58());

      // Create the transaction
      const { transaction, message } = await preparePlayTransaction(
        userPublicKey,
        Number(amount)
      );

      // Create response payload
      const payload: ActionPostResponse = {
        transaction: transaction
          .serialize({ requireAllSignatures: false })
          .toString("base64"),
        message,
      };

      // Send response
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.status(200).json(payload);
    } catch (error: any) {
      console.error("Error processing request:", error);
      res.status(500).json({ error: error.message });
    }
  } else {
    // Handle unsupported methods
    res.setHeader("Allow", ["GET", "POST", "OPTIONS"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// Include the `OPTIONS` to ensure CORS works for Blinks
export const OPTIONS = handler;
