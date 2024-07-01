// src/pages/api/gamba/stats.ts
import type { NextApiRequest, NextApiResponse } from "next";

import { CREATOR_ADDRESS } from "@/utils/constants";
import { fetchDataFromGambaAPI } from ".";

export default async function handleStats(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const queryParams: Record<string, string> = {
      creator: CREATOR_ADDRESS,
    };

    const data = await fetchDataFromGambaAPI("/stats", queryParams);
    res.status(200).json(data);
  } catch (error: any) {
    res
      .status(500)
      .json({ error: error.message || "An unexpected error occurred" });
  }
}
