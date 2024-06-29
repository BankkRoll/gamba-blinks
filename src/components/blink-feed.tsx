// src/components/blink-feed.tsx

import { RecentPlay } from "./blink";
import { useBlinkEvents } from "@/hooks/use-blink-events";

export default function BlinksFeed() {
  const blinks = useBlinkEvents();

  return (
    <div className="max-w-5xl w-full relative flex flex-col gap-2.5">
      {blinks.length > 0 ? (
        blinks.map((tx, index) => (
          <div key={tx.signature + "-" + index}>
            <RecentPlay event={tx} time={tx.time} />
          </div>
        ))
      ) : (
        <div className="flex items-center justify-center w-full h-10 bg-accent rounded-lg">
          No events found
        </div>
      )}
    </div>
  );
}
