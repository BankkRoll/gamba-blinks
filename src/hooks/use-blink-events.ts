// src/hooks/use-blink-events.ts

import { useGambaEventListener, useGambaEvents } from "gamba-react-v2";
import { useMemo, useState } from "react";

import { GambaTransaction } from "gamba-core-v2";

export function useBlinkEvents() {
  const previousEvents = useGambaEvents("GameSettled");

  const [newEvents, setNewEvents] = useState<GambaTransaction<"GameSettled">[]>(
    []
  );

  useGambaEventListener(
    "GameSettled",
    (event: GambaTransaction<"GameSettled">) => {
      const [version, gameId, ...rest] = event.data.metadata.split(":");
      const eventExists = newEvents.some(
        (e) => e.signature === event.signature
      );

      // Convert gameId to lowercase for case-insensitive comparison
      if (!eventExists && gameId.toLowerCase() === "blinks") {
        setNewEvents((prevEvents) => [event, ...prevEvents]);
      }
    },
    [newEvents]
  );

  const filteredEvents = useMemo(() => {
    const allEvents = [...newEvents, ...previousEvents];
    const uniqueEvents = allEvents.filter(
      (event, index, self) =>
        index === self.findIndex((e) => e.signature === event.signature)
    );
    // Filter events to only show Blinks
    const filteredBlinksEvents = uniqueEvents.filter(
      (event) => event.data.metadata.split(":")[1].toLowerCase() === "blinks"
    );
    return filteredBlinksEvents.sort((a, b) => b.time - a.time);
  }, [newEvents, previousEvents]);

  return filteredEvents;
}
