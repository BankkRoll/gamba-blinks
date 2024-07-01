// src/pages/player/[userPublicKey].tsx

import { ApiResponse, GambaEvent } from "@/utils/types";
import { useEffect, useState } from "react";

import { CREATOR_ADDRESS } from "@/utils/constants";
import { DataTable } from "@/components/data-table/data-table";
import Player from "@/components/player";
import { useRouter } from "next/router";

export default function PlayerDashboard() {
  const router = useRouter();
  const { userPublicKey } = router.query;

  const [blinks, setBlinks] = useState<GambaEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    if (!userPublicKey) return; // Wait for userPublicKey to be available

    async function fetchBlinks() {
      try {
        setPageLoading(true);
        const response = await fetch(
          `/api/gamba/settled-games?page=${currentPage}&itemsPerPage=${itemsPerPage}&creator=${CREATOR_ADDRESS}&user=${userPublicKey}`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const data: ApiResponse = await response.json();
        setBlinks(data.results);
      } catch (error: any) {
        setError(error.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
        setPageLoading(false);
      }
    }

    fetchBlinks();
  }, [currentPage, itemsPerPage, userPublicKey]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="container mx-auto flex flex-col items-center">
      <Player userPublicKey={userPublicKey as string} />
      <DataTable
        data={blinks}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        pageLoading={pageLoading}
      />
      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
}
