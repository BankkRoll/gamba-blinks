// src/components/blink.tsx

import { BPS_PER_WHOLE, GambaTransaction } from "gamba-core-v2";

import { useMemo } from "react";

interface RecentPlayProps {
  event: GambaTransaction<"GameSettled">;
  time: number;
}

function TimeDiff({ time, suffix = "ago" }: { time: number; suffix?: string }) {
  const diff = Date.now() - time;
  const timeString = useMemo(() => {
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    if (hours >= 1) {
      return `${hours}h ${suffix}`;
    }
    if (minutes >= 1) {
      return `${minutes}m ${suffix}`;
    }
    return "Just now";
  }, [diff, suffix]);

  return <span className="text-sm md:text-base">{timeString}</span>;
}

export function RecentPlay({ event, time }: RecentPlayProps) {
  const data = event.data;

  const multiplier = data.bet[data.resultIndex.toNumber()] / BPS_PER_WHOLE;
  const wager = data.wager.toNumber();
  const payout = multiplier * wager;
  const profit = payout - wager;

  return (
    <a
      href={`https://solscan.io/tx/${event.signature}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`text-secondary flex items-center justify-between p-4 mb-2 rounded-lg shadow transition-all duration-300 ${
        profit > 0
          ? "bg-green-400 hover:bg-green-500 "
          : "bg-red-400 hover:bg-red-500"
      }`}
    >
      <div className="text-sm md:text-base">
        {`${data.user.toBase58().substring(0, 4)}...${data.user
          .toBase58()
          .slice(-4)}`}
      </div>
      <div className="text-sm font-bold md:text-base">
        {profit >= 0 ? "WON" : "LOST"}
      </div>
      <div className="flex items-center gap-2 text-sm md:text-base">
        <img
          src="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png"
          alt="Token"
          width={24}
          className="rounded-full"
        />
        <span>{(profit / 1e9).toLocaleString()}</span>
      </div>
      <div className="hidden text-sm md:flex md:text-base">
        {multiplier.toFixed(2)}x
      </div>
      {data.jackpotPayoutToUser.toNumber() > 0 && (
        <div className="flex items-center gap-2 p-1 text-black bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 rounded-lg animate-jackpotGradient">
          +<span>{data.jackpotPayoutToUser.toNumber()}</span>
        </div>
      )}
      <TimeDiff time={time} />
    </a>
  );
}
