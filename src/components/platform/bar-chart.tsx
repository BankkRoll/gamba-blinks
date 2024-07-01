// src/components/platform/bar-chart.tsx

import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import React, { useEffect, useState } from "react";

import { CREATOR_ADDRESS } from "@/utils/constants";

interface ChartDataItem {
  name: string;
  profit: number;
  loss: number;
}

interface OverviewProps {
  timeFrame: "7D" | "14D" | "30D" | "All";
}

const generateDateRange = (days: number): string[] => {
  const dates = [];
  const now = new Date();
  for (let i = 0; i < days; i++) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    dates.push(date.toLocaleDateString("en-US"));
  }
  return dates.reverse();
};

export const Overview: React.FC<OverviewProps> = ({ timeFrame }) => {
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllDataAndAggregate = async () => {
      try {
        let allData: any[] = [];
        let currentPage = 0;
        let hasMoreData = true;

        while (hasMoreData) {
          const response = await fetch(
            `/api/gamba/settled-games?page=${currentPage}&itemsPerPage=200&creator=${CREATOR_ADDRESS}`,
          );
          if (!response.ok)
            throw new Error("Failed to fetch settled games data");
          const { results, total } = await response.json();

          if (results.length === 0 || allData.length >= total) {
            hasMoreData = false;
          } else {
            allData.push(...results);
            currentPage++;
          }

          // Check if we have enough data to render the initial chart
          if (allData.length >= 200) {
            break;
          }
        }

        const now = Date.now();
        const timeFrameDays = {
          "7D": 7,
          "14D": 14,
          "30D": 30,
          All: Math.floor(
            (now - new Date(0).getTime()) / (1000 * 60 * 60 * 24),
          ),
        }[timeFrame];

        const dateRange = generateDateRange(timeFrameDays);

        const filteredData = allData.filter((item) => {
          const itemDate = new Date(item.time).getTime();
          switch (timeFrame) {
            case "7D":
              return now - itemDate < 604800000; // 7 * 24 * 60 * 60 * 1000
            case "14D":
              return now - itemDate < 1209600000; // 14 * 24 * 60 * 60 * 1000
            case "30D":
            default:
              return true;
          }
        });

        const aggregatedData = dateRange.map((dateStr) => {
          const entry = filteredData.find(
            (item) =>
              new Date(item.time).toLocaleDateString("en-US") === dateStr,
          ) || {
            name: dateStr,
            profit: 0,
            loss: 0,
          };
          if (entry.usd_profit > 0) {
            entry.profit = entry.usd_profit;
            entry.loss = 0;
          } else {
            entry.profit = 0;
            entry.loss = Math.abs(entry.usd_profit);
          }
          return entry;
        });

        setChartData(
          aggregatedData.sort(
            (a, b) => new Date(a.name).getTime() - new Date(b.name).getTime(),
          ),
        );

        // Continue fetching remaining data in the background
        while (hasMoreData) {
          const response = await fetch(
            `/api/gamba/settled-games?page=${currentPage}&itemsPerPage=200&creator=${CREATOR_ADDRESS}`,
          );
          if (!response.ok)
            throw new Error("Failed to fetch settled games data");
          const { results, total } = await response.json();

          if (results.length === 0 || allData.length >= total) {
            hasMoreData = false;
          } else {
            allData.push(...results);
            currentPage++;
          }
        }
      } catch (error: any) {
        setError(error.message);
        console.error(error);
      }
    };

    fetchAllDataAndAggregate();
  }, [timeFrame]);

  return (
    <ResponsiveContainer className="min-h-96" width="100%">
      <BarChart data={chartData}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickFormatter={(value) => `$${value.toFixed(2)}`}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-background p-4 rounded-lg text-white font-sans space-y-1">
                  <div className="flex gap-2 justify-between">
                    <span>Won:</span>
                    <strong className="text-green-500">
                      +${payload[0].payload.profit.toFixed(2)}
                    </strong>
                  </div>
                  <div className="flex gap-2 justify-between">
                    <span>Spent:</span>
                    <strong className="text-red-500">
                      -${payload[0].payload.loss.toFixed(2)}
                    </strong>
                  </div>
                  <div className="flex gap-2 justify-between pt-2 border-t border-gray-400">
                    <span>Profit:</span>
                    <strong
                      className={
                        payload[0].payload.profit - payload[0].payload.loss >= 0
                          ? "text-green-500"
                          : "text-red-500"
                      }
                    >
                      $
                      {(
                        payload[0].payload.profit - payload[0].payload.loss
                      ).toFixed(2)}
                    </strong>
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
        <Legend />
        <Bar
          dataKey="profit"
          fill="#4caf50"
          name="Profit"
          radius={[10, 10, 0, 0]}
        />
        <Bar
          dataKey="loss"
          fill="#f44336"
          name="Loss"
          radius={[10, 10, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
