// src/pages/api/gamba/players.ts
import type { NextApiRequest, NextApiResponse } from "next";

import { CREATOR_ADDRESS } from "@/utils/constants";
import { fetchDataFromGambaAPI } from ".";

export default async function handlePlayers(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const queryParams: Record<string, string> = {
      creator: CREATOR_ADDRESS,
    };

    if (req.query.token) queryParams.token = req.query.token as string;
    if (req.query.pool) queryParams.pool = req.query.pool as string;

    queryParams.sortBy = req.query.sortBy
      ? (req.query.sortBy as string)
      : "usd_profit";

    if (
      !queryParams.token &&
      !queryParams.pool &&
      ["token_volume", "token_profit"].includes(queryParams.sortBy)
    ) {
      return res.status(403).json({
        error: `Token or pool required to sort by ${queryParams.sortBy}`,
      });
    }

    const limit = Number(req.query.limit ?? 5);
    queryParams.limit = limit >= 1 && limit <= 5000 ? limit.toString() : "5";
    const offset = Number(req.query.offset ?? 0);
    queryParams.offset = offset.toString();

    if (req.query.startTime)
      queryParams.startTime = req.query.startTime as string;

    const data = await fetchDataFromGambaAPI("/players", queryParams);
    res.status(200).json(data);
  } catch (error: any) {
    res
      .status(500)
      .json({ error: error.message || "An unexpected error occurred" });
  }
}
