// src/pages/api/gamba/settled-games.ts
import type { NextApiRequest, NextApiResponse } from "next";

import { CREATOR_ADDRESS } from "@/utils/constants";
import { fetchDataFromGambaAPI } from ".";

export default async function handleSettledGames(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const queryParams: Record<string, string | number> = {
      creator: CREATOR_ADDRESS,
    };

    const page = req.query.page ? parseInt(req.query.page as string, 10) : 0;
    const itemsPerPage = req.query.itemsPerPage
      ? parseInt(req.query.itemsPerPage as string, 10)
      : 10;

    if (itemsPerPage < 1 || itemsPerPage > 200) {
      res.status(400).json({ error: "itemsPerPage must range between 1-200" });
      return;
    }

    if (req.query.pool) queryParams.pool = req.query.pool as string;
    if (req.query.user) queryParams.user = req.query.user as string;

    queryParams.page = page;
    queryParams.itemsPerPage = itemsPerPage;

    const data = await fetchDataFromGambaAPI(
      "/events/settledGames",
      queryParams as any,
    );
    res.status(200).json(data);
  } catch (error: any) {
    res
      .status(500)
      .json({ error: error.message || "An unexpected error occurred" });
  }
}
