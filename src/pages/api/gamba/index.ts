// src/pages/api/gamba/index.ts

import NodeCache from "node-cache";
import fetch from "node-fetch";

const cache = new NodeCache({ stdTTL: 600, checkperiod: 1200 });

export async function fetchDataFromGambaAPI(
  endpoint: string,
  params: Record<string, any>,
  retryCount = 3,
) {
  const queryParams = new URLSearchParams(params).toString();
  const cacheKey = `${endpoint}?${queryParams}`;
  const cachedResponse = cache.get(cacheKey);

  if (cachedResponse) {
    return cachedResponse;
  }

  let attempts = 0;
  let backoff = 500;

  while (attempts < retryCount) {
    try {
      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
      };

      const response = await fetch(
        `https://api.gamba.so${endpoint}?${queryParams}`,
        { method: "GET", headers },
      );

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
          `Failed to fetch: ${response.status} ${response.statusText} - ${errorBody}`,
        );
      }

      const data = await response.json();
      cache.set(cacheKey, data, 600);
      return data;
    } catch (error) {
      console.error(`Attempt ${attempts + 1} failed: ${error}`);

      if (attempts === retryCount - 1) {
        throw error;
      }

      await new Promise((resolve) => setTimeout(resolve, backoff));
      backoff *= 2;
      attempts++;
    }
  }
}
