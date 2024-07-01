import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import React, { useState } from "react";

import { Button } from "../ui/button";
import PlayerStatsCards from "./player-stats";
import { PublicKey } from "@solana/web3.js";
import { UserOverview } from "./bar-chart";

interface PlayerProps {
  userPublicKey: string | PublicKey;
}

const Player: React.FC<PlayerProps> = ({ userPublicKey }) => {
  const [filter, setFilter] = useState<"7D" | "14D" | "30D" | "All">("7D");
  const [error, setError] = useState<string | null>(null);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="flex-col flex w-full">
      <div className="flex-1 space-y-4 py-4">
        <PlayerStatsCards userPublicKey={userPublicKey} />
        <div className="w-full gap-4">
          <Card className="border border-base col-span-3 md:col-span-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>{filter} Player Overview</CardTitle>
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
              <UserOverview
                timeFrame={filter as "7D" | "14D" | "30D" | "All"}
                userPublicKey={userPublicKey}
              />{" "}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Player;
