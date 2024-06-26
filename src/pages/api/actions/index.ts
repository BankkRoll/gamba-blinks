// src/pages/api/actions/index.ts
import { NextApiRequest, NextApiResponse } from "next";
import { ActionsSpecGetResponse } from "@/types";

const actionResponse: ActionsSpecGetResponse = {
  icon: "https://gamba-blinks.vercel.app/logo.png",
  title: "Play Coin Flip On-Chain Anywhere With Gamba Blinks",
  description: "Bet SOL on heads or tails and win double or nothing!",
  label: "Flip Coin",
  links: {
    actions: [
      { label: "Heads", href: "/api/actions/setSide?side=heads" },
      { label: "Tails", href: "/api/actions/setSide?side=tails" },
      { label: "Set Amount", href: "/api/actions/setAmount?amount=0.1" },
      { label: "Play", href: "/api/actions/play" },
    ],
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    res.status(200).json(actionResponse);
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
