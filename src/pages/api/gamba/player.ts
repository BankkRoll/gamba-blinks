// src/pages/api/gamba/player.ts
import type { NextApiRequest, NextApiResponse } from "next";

import { CREATOR_ADDRESS } from "@/utils/constants";
import { fetchDataFromGambaAPI } from ".";

export default async function handlePlayer(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const queryParams: Record<string, string> = {
      creator: CREATOR_ADDRESS,
    };

    if (req.query.user) queryParams.user = req.query.user as string;
    if (req.query.token) queryParams.token = req.query.token as string;

    const data = await fetchDataFromGambaAPI("/player", queryParams);
    res.status(200).json(data);
  } catch (error: any) {
    res
      .status(500)
      .json({ error: error.message || "An unexpected error occurred" });
  }
}
