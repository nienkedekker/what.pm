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
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-medium tracking-[-0.01em]">Listening</h3>
        {track && (
          <span className="flex items-center gap-2 text-xs text-ink-soft">
            {isNowPlaying && (
              <span className="flex h-2.5 items-end gap-[2px]" aria-hidden="true">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-[2px] animate-[eq_900ms_ease-in-out_infinite_alternate] rounded-full bg-accent"
                    style={{ animationDelay: `${i * 180}ms`, height: "100%" }}
                  />
                ))}
              </span>
            )}
            {isNowPlaying ? "Now playing" : "Last played"}
          </span>
        )}
      </div>

      {/* Record sleeve with the vinyl peeking out */}
      <div className="my-auto py-8">
        <div className="relative aspect-square w-[70%] max-w-40">
          <div
            className={`absolute inset-y-[4%] left-[38%] aspect-square rounded-full bg-[repeating-radial-gradient(circle,#0d0d0f_0_2px,#1c1d21_2px_4px)] shadow-xl ring-1 ring-white/5 ${
              isNowPlaying ? "animate-spin-slow" : ""
            }`}
            aria-hidden="true"
          >
            <span className="absolute inset-[34%] rounded-full bg-accent" />
            <span className="absolute inset-[47%] rounded-full bg-paper" />
          </div>
          <div className="relative size-full overflow-hidden rounded-lg bg-panel-2 shadow-xl ring-1 ring-line">
            {cover ? (
              <img src={cover} alt="" className="size-full object-cover" loading="lazy" />
            ) : (
              <span className="grid size-full place-items-center text-4xl text-ink-faint">♪</span>
            )}
          </div>
        </div>
      </div>

      <div className="min-w-0">
        {loading ? (
          <p className="text-sm text-ink-faint">Tuning in…</p>
        ) : track ? (
          <a href={track.url} target="_blank" rel="noopener noreferrer" className="group block">
            <span className="block truncate font-medium group-hover:underline group-hover:decoration-line-strong group-hover:underline-offset-4">
              {track.name}
            </span>
            <span className="mt-0.5 block truncate text-sm text-ink-soft">{artist}</span>
          </a>
        ) : (
          <p className="text-sm text-ink-faint">Silence, for now.</p>
        )}
      </div>
    </div>
  );
}
