import { useState, useEffect } from "react";

function MusicNoteIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="currentColor"
      className="size-4"
    >
      <path d="M128,184a40,40,0,1,1-40-40A40,40,0,0,1,128,184Z" opacity="0.2" />
      <path d="M210.3,56.34l-80-24A8,8,0,0,0,120,40V148.26A48,48,0,1,0,136,184V98.75l69.7,20.91A8,8,0,0,0,216,112V64A8,8,0,0,0,210.3,56.34ZM88,216a32,32,0,1,1,32-32A32,32,0,0,1,88,216ZM200,101.25l-64-19.2V50.75L200,70Z" />
    </svg>
  );
}

interface Track {
  name: string;
  url: string;
  artist: { name?: string; "#text"?: string };
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

  if (loading || !track) return null;

  const isNowPlaying = track["@attr"]?.nowplaying === "true";
  const label = isNowPlaying ? "Now playing" : "Last played";

  return (
    <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
      <MusicNoteIcon />
      <span className="font-medium text-gray-700 dark:text-gray-300">{label}:</span>
      <a
        href={track.url}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-accent dark:hover:text-accent-light transition-colors"
      >
        {track.artist.name || track.artist["#text"]} – {track.name}
      </a>
    </div>
  );
}
