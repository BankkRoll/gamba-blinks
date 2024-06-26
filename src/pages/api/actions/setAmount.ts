import { NextApiRequest, NextApiResponse } from "next";
import { ActionsSpecPostResponse } from "@/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const { amount } = req.body;

    // Logic to handle setting the amount
    const response: ActionsSpecPostResponse = {
      transaction: `Amount set to ${amount}`,
    };
    return res.status(200).json(response);
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
