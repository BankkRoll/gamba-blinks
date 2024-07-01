// src/components/columns/columns.tsx

"use client";

import { ClipboardCopy, ExternalLink, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { GambaEvent } from "@/utils/types";

export const columns: ColumnDef<GambaEvent>[] = [
  {
    accessorKey: "user",
    header: "User",
    cell: ({ row }) => (
      <div>{`${row.original.user.substring(0, 4)}...${row.original.user.slice(
        -4,
      )}`}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        className={`text-sm font-bold ${
          row.original.profit >= 0 ? "bg-green-400" : "bg-red-400"
        }`}
      >
        {row.original.profit >= 0 ? "WON" : "LOST"}
      </Badge>
    ),
  },
  {
    accessorKey: "profit",
    header: () => <div className="text-right">Profit</div>,
    cell: ({ row }) => {
      const profit = parseFloat(row.getValue("profit"));

      return (
        <div className="text-right font-medium">
          {(profit / 1e9).toLocaleString()}
        </div>
      );
    },
  },
  {
    accessorKey: "multiplier",
    header: "Multiplier",
    cell: ({ row }) => `${row.original.multiplier.toFixed(2)}x`,
  },
  {
    accessorKey: "time",
    header: "Time",
    cell: ({ row }) => {
      const time = new Date(row.original.time).toLocaleString();
      return <div>{time}</div>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const event = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <div className="flex items-center">
                    <ClipboardCopy className="mr-2 h-4 w-4" />
                    Copy
                  </div>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem
                    onClick={() => navigator.clipboard.writeText(event.user)}
                  >
                    Player Address
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      navigator.clipboard.writeText(event.signature)
                    }
                  >
                    Txn Signature
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <div className="cursor-pointer flex items-center">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Txn
                  </div>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem asChild>
                    <a
                      href={`https://solscan.io/tx/${event.signature}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cursor-pointer"
                    >
                      Solscan
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a
                      href={`https://explorer.solana.com/tx/${event.signature}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cursor-pointer"
                    >
                      Solana Explorer
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a
                      href={`https://solana.fm/tx/${event.signature}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cursor-pointer"
                    >
                      Solana FM
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a
                      href={`https://explorer.gamba.so/tx/${event.signature}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cursor-pointer"
                    >
                      Gamba Explorer
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <div className="cursor-pointer flex items-center">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View User
                  </div>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem asChild>
                    <a
                      href={`https://solscan.io/address/${event.user}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cursor-pointer"
                    >
                      Solscan
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a
                      href={`https://explorer.solana.com/address/${event.user}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cursor-pointer"
                    >
                      Solana Explorer
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a
                      href={`https://solana.fm/address/${event.user}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cursor-pointer"
                    >
                      Solana FM
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a
                      href={`https://explorer.gamba.so/player/${event.user}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cursor-pointer"
                    >
                      Gamba Explorer
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
