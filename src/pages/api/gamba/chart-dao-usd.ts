// src/pages/api/gamba/chart-dao-usd.ts
import type { NextApiRequest, NextApiResponse } from "next";

import { CREATOR_ADDRESS } from "@/utils/constants";
import { fetchDataFromGambaAPI } from ".";

export default async function handleDaoUsd(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const queryParams: Record<string, string> = {
      creator: CREATOR_ADDRESS,
    };

    if (req.query.from) queryParams.from = req.query.from as string;
    if (req.query.until) queryParams.until = req.query.until as string;

    const data = await fetchDataFromGambaAPI("/chart/dao-usd", queryParams);
    res.status(200).json(data);
  } catch (error: any) {
    res
      .status(500)
      .json({ error: error.message || "An unexpected error occurred" });
  }
}
