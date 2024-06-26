import { NextApiRequest, NextApiResponse } from "next";
import { ActionsSpecPostResponse } from "@/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const { side } = req.body;

    // Logic to handle setting the side
    const response: ActionsSpecPostResponse = {
      transaction: `Side set to ${side}`,
    };
    return res.status(200).json(response);
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
