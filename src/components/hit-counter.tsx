import { useState, useEffect } from "react";

export default function HitCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    // Check if we've already counted this session
    const hasVisited = sessionStorage.getItem("counted");

    if (hasVisited) {
      // Just fetch the count without incrementing
      fetch("/api/hit-counter")
        .then((res) => res.json())
        .then((data) => setCount(data.count))
        .catch(() => setCount(0));
    } else {
      // Increment and fetch
      fetch("/api/hit-counter", { method: "POST" })
        .then((res) => res.json())
        .then((data) => {
          setCount(data.count);
          sessionStorage.setItem("counted", "true");
        })
        .catch(() => setCount(0));
    }
  }, []);

  if (count === null) {
    return <div className="font-mono text-xs text-gray-500 dark:text-gray-400">Loading...</div>;
  }

  const formattedCount = count.toString().padStart(6, "0");

  return (
    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
      <span>You are visitor</span>
      <span className="font-mono bg-black text-green-400 px-2 py-0.5 tracking-widest">
        #{formattedCount}
      </span>
    </div>
  );
}
