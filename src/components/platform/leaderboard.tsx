// src/components/platform/leaderboard.tsx

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  CrownIcon,
  MedalIcon,
  RibbonIcon,
  StarIcon,
  TrophyIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";

import { CREATOR_ADDRESS } from "@/utils/constants";
import { Card } from "../ui/card";

type Player = {
  user: string;
  usd_profit: number;
  usd_volume: number;
};

type PlayersApiResponse = {
  players: Player[];
};

const fetchPlayersData = async (): Promise<PlayersApiResponse> => {
  const response = await fetch(
    `/api/gamba/players?limit=5&sortBy=usd_profit&creator=${CREATOR_ADDRESS}`,
  );
  if (!response.ok) throw new Error("Network response was not ok");
  return response.json();
};

const generateGambaLink = (user: string) =>
  `https://explorer.gamba.so/player/${user}`;

export function PlayerLeaderboard() {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    fetchPlayersData()
      .then((data) => {
        const sortedPlayers = data.players.sort(
          (a, b) => b.usd_profit - a.usd_profit || b.usd_volume - a.usd_volume,
        );
        setPlayers(sortedPlayers);
      })
      .catch((error) => console.error("Failed to fetch players:", error));
  }, []);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <MedalIcon className="text-yellow-400 h-4 w-4 md:h-6 md:w-6" />;
      case 1:
        return <CrownIcon className="text-gray-400 h-4 w-4 md:h-6 md:w-6" />;
      case 2:
        return <TrophyIcon className="text-amber-800 h-4 w-4 md:h-6 md:w-6" />;
      case 3:
        return <StarIcon className="text-blue-400 h-4 w-4 md:h-6 md:w-6" />;
      case 4:
        return <RibbonIcon className="text-green-400 h-4 w-4 md:h-6 md:w-6" />;
      default:
        return <span className="text-xs md:text-sm">#{index + 1}</span>;
    }
  };

  return (
    <div className="w-full relative flex flex-col justify-normal items-center gap-2 md:gap-4">
      <Card className="w-full cursor-pointer border-none">
        <div className="flex flex-col gap-2 md:gap-4">
          {players.map((player, index) => (
            <div
              key={player.user}
              onClick={() =>
                window.open(generateGambaLink(player.user), "_blank")
              }
              className="transition-all flex items-center justify-between p-1 md:p-2 bg-background hover:bg-accent border border-base rounded-lg shadow-lg cursor-pointer"
            >
              <div className="flex items-center gap-2 md:gap-4">
                {getRankIcon(index)}
                <Avatar className="bg-card h-8 w-8 md:h-10 md:w-10">
                  <AvatarFallback className="bg-card">
                    {player.user.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <p className="text-sm md:text-md font-semibold">
                  {player.user.substring(0, 6)}...{player.user.slice(-4)}
                </p>
              </div>
              <div>
                <p className="text-sm md:text-lg font-medium">
                  Profit: ${player.usd_profit.toFixed(2)}
                </p>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Volume: ${player.usd_volume.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
