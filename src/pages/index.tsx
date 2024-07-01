// src/pages/index.tsx

import { ApiResponse, GambaEvent } from "@/utils/types";
import { useEffect, useState } from "react";

import { CREATOR_ADDRESS } from "@/utils/constants";
import { DataTable } from "@/components/data-table/data-table";
import Platform from "@/components/platform";

export default function Home() {
  const [blinks, setBlinks] = useState<GambaEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    async function fetchBlinks() {
      try {
        setPageLoading(true);
        const response = await fetch(
          `/api/gamba/settled-games?page=${currentPage}&itemsPerPage=${itemsPerPage}&creator=${CREATOR_ADDRESS}`,
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
  }, [currentPage, itemsPerPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="container mx-auto flex flex-col items-center">
      <Platform />
      <DataTable
        data={blinks}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        pageLoading={pageLoading}
      />
    </div>
  );
}
