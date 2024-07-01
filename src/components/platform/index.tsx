// src/components/platform/index.tsx

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import React, { useEffect, useState } from "react";

import { Button } from "../ui/button";
import { CREATOR_ADDRESS } from "@/utils/constants";
import { Overview } from "./bar-chart";
import { PlayerLeaderboard } from "./leaderboard";
import { formatDistanceToNow } from "date-fns";

interface StatsData {
  players: number;
  usd_volume: number;
  plays: number;
  creators: number;
  revenue_usd: number;
  player_net_profit_usd: number;
  active_players: number;
  first_bet_time: number;
}

const fetchStatsData = async (): Promise<StatsData> => {
  const response = await fetch(`/api/gamba/stats?creator=${CREATOR_ADDRESS}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const Platform: React.FC = () => {
  const [filter, setFilter] = useState<"7D" | "14D" | "30D" | "All">("7D");
  const [stats, setStats] = useState<StatsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStatsData()
      .then(setStats)
      .catch((error) => {
        setError(error.message);
        console.error(error);
      });
  }, []);

  const sinceFirstPlay = (timestamp: number) => {
    const date = new Date(timestamp);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="flex-col flex w-full">
      <div className="flex-1 space-y-4 py-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Volume</CardTitle>
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
              <div className="text-2xl font-bold">
                {typeof stats?.usd_volume === "number"
                  ? `$${stats.usd_volume.toFixed(2)}`
                  : "0"}
              </div>
              <p className="text-xs text-muted-foreground">
                Estimated Revenue: $
                {typeof stats?.revenue_usd === "number"
                  ? `${stats.revenue_usd.toFixed(2)}`
                  : "0"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Plays</CardTitle>
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
                {typeof stats?.plays === "number" ? stats.plays : "0"}
              </div>
              <p className="text-xs text-muted-foreground">
                First Play:{" "}
                {stats?.first_bet_time
                  ? sinceFirstPlay(stats.first_bet_time)
                  : "0"}
              </p>
            </CardContent>
          </Card>
          <Card className="md:col-span-2 lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Players</CardTitle>
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
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {typeof stats?.players === "number" ? stats.players : "0"}
              </div>
              <p className="text-xs text-muted-foreground">
                Active Players:{" "}
                {typeof stats?.active_players === "number"
                  ? stats.active_players
                  : "0"}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="border border-base col-span-3 md:col-span-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>{filter} Platform Overview</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">{filter}</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Filter By</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setFilter("7D")}>
                    7D
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter("14D")}>
                    14D
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter("30D")}>
                    30D
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              <Overview timeFrame={filter} />
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Player Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              <PlayerLeaderboard />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Platform;
