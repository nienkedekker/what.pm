import { useState, useEffect } from "react";

interface Track {
  name: string;
  url: string;
  artist: { name?: string; "#text"?: string };
  image?: { size: string; "#text": string }[];
  date?: { uts: string };
  "@attr"?: { nowplaying: string };
}

export default function NowPlaying() {
  const [track, setTrack] = useState<Track | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrack = async () => {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);

        const res = await fetch(
          "https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=shinyhats&api_key=54f8f15133336606e882fdf20148d123&limit=1&format=json",
          { signal: controller.signal }
        );
        clearTimeout(timeout);

        if (!res.ok) return;

        const data = await res.json();
        setTrack(data?.recenttracks?.track?.[0] || null);
      } catch {
        // Silently fail - site works fine without Last.fm
      } finally {
        setLoading(false);
      }
    };

    fetchTrack();
    const interval = setInterval(fetchTrack, 30000);
    return () => clearInterval(interval);
  }, []);

  const isNowPlaying = track?.["@attr"]?.nowplaying === "true";
  const artist = track?.artist.name || track?.artist["#text"];
  const cover = track?.image?.find((i) => i.size === "extralarge")?.["#text"];

  return (
    <div className="flex h-full flex-col">
      {/* Record sleeve with the vinyl peeking out */}
      <div className="relative mb-6 aspect-square w-[70%] max-w-40">
        <div
          className={`absolute inset-y-[4%] left-[38%] aspect-square rounded-full bg-[repeating-radial-gradient(circle,#111_0_2px,#222_2px_4px)] shadow-lg ${
            isNowPlaying ? "animate-spin-slow" : ""
          }`}
          aria-hidden="true"
        >
          <span className="absolute inset-[34%] rounded-full bg-cobalt" />
          <span className="absolute inset-[47%] rounded-full bg-lime" />
        </div>
        <div className="relative size-full overflow-hidden rounded-md bg-white shadow-lg">
          {cover ? (
            <img src={cover} alt="" className="size-full object-cover" loading="lazy" />
          ) : (
            <span className="grid size-full place-items-center font-display text-5xl text-cobalt">
              ♪
            </span>
          )}
        </div>
      </div>

      <div className="mt-auto min-w-0">
        {loading ? (
          <p className="text-sm text-ink-faint">Tuning in…</p>
        ) : track ? (
          <a href={track.url} target="_blank" rel="noopener noreferrer" className="group block">
            <span className="block truncate font-display text-lg font-bold tracking-tight group-hover:underline">
              {track.name}
            </span>
            <span className="block truncate text-sm text-ink-soft">{artist}</span>
            <span className="mt-3 flex items-center gap-2 text-xs text-ink-soft">
              {isNowPlaying && (
                <span className="flex h-3 items-end gap-[2px]" aria-hidden="true">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-[3px] animate-[eq_900ms_ease-in-out_infinite_alternate] rounded-full bg-ink"
                      style={{ animationDelay: `${i * 180}ms`, height: "100%" }}
                    />
                  ))}
                </span>
              )}
              {isNowPlaying ? "Playing right now on Last.fm" : "Last played on Last.fm"}
            </span>
          </a>
        ) : (
          <p className="text-sm text-ink-faint">Silence, for now.</p>
        )}
      </div>
    </div>
  );
}
