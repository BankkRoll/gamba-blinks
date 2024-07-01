// src/components/profile/PlayerStats.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useEffect, useState } from "react";

import { CREATOR_ADDRESS } from "@/utils/constants";
import { PublicKey } from "@solana/web3.js";
import { formatDistanceToNow } from "date-fns";

interface PlayerStatsApiResponse {
  games_played: number;
  usd_profit: number;
  usd_creator_fees_paid: number;
  usd_pool_fees_paid: number;
  usd_dao_fees_paid: number;
  usd_volume: number;
  games_won: number;
  randomness_score: number;
  first_bet_time: number;
}

interface PlayerStatsCardsProps {
  userPublicKey: string | PublicKey;
}

const fetchPlayerStats = async (
  userPublicKey: string | PublicKey,
): Promise<PlayerStatsApiResponse> => {
  const response = await fetch(
    `/api/gamba/player?user=${userPublicKey}&creator=${CREATOR_ADDRESS}`,
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const PlayerStatsCards: React.FC<PlayerStatsCardsProps> = ({
  userPublicKey,
}) => {
  const [playerStats, setPlayerStats] = useState<PlayerStatsApiResponse | null>(
    null,
  );

  useEffect(() => {
    fetchPlayerStats(userPublicKey).then(setPlayerStats).catch(console.error);
  }, [userPublicKey]);

  const sinceFirstPlay = (timestamp: string | number | Date) => {
    const date = new Date(timestamp);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Plays</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <path d="M2 10h20" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {typeof playerStats?.games_played === "number"
              ? playerStats.games_played
              : "N/A"}
          </div>
          <p className="text-xs text-muted-foreground">
            {typeof playerStats?.games_won === "number" &&
            typeof playerStats?.games_played === "number"
              ? `${playerStats.games_won} wins - ${
                  playerStats.games_played - playerStats.games_won
                } losses`
              : "N/A"}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {" "}
            Total USD Spent:
          </CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold grid grid-cols-2">
            <div className="col-span-1">
              {typeof playerStats?.usd_volume === "number" &&
              typeof playerStats?.usd_profit === "number"
                ? `$${(playerStats.usd_volume - playerStats.usd_profit).toFixed(
                    2,
                  )}`
                : "N/A"}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Fees Paid: Creator $
            {typeof playerStats?.usd_creator_fees_paid === "number"
              ? playerStats.usd_creator_fees_paid.toFixed(2)
              : "N/A"}{" "}
            - Pool $
            {typeof playerStats?.usd_pool_fees_paid === "number"
              ? playerStats.usd_pool_fees_paid.toFixed(2)
              : "N/A"}{" "}
            - DAO $
            {typeof playerStats?.usd_dao_fees_paid === "number"
              ? playerStats.usd_dao_fees_paid.toFixed(2)
              : "N/A"}
          </p>
        </CardContent>
      </Card>
      <Card className="md:col-span-2 lg:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {" "}
            Total USD Profit:
          </CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold grid grid-cols-2">
            <div className="text-2xl font-bold">
              {typeof playerStats?.usd_profit === "number"
                ? `$${playerStats.usd_profit.toFixed(2)}`
                : "N/A"}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            First Play:{" "}
            {playerStats && typeof playerStats.first_bet_time === "number"
              ? sinceFirstPlay(new Date(playerStats.first_bet_time))
              : "N/A"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlayerStatsCards;
