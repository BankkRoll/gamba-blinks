// src/pages/index.tsx

import BlinksFeed from "@/components/blink-feed";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-start p-6">
      <h1 className="text-5xl font-extrabold text-white mb-4">Gamba Blinks</h1>
      <BlinksFeed />
    </div>
  );
}
