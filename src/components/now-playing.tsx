import { useState, useEffect } from 'react';
import { MusicNote } from '@phosphor-icons/react';

interface Track {
  name: string;
  url: string;
  artist: { name?: string; '#text'?: string };
  date?: { uts: string };
  '@attr'?: { nowplaying: string };
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
          'https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=shinyhats&api_key=54f8f15133336606e882fdf20148d123&limit=1&format=json',
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

  const isNowPlaying = track['@attr']?.nowplaying === 'true';
  const label = isNowPlaying ? 'Now playing' : 'Last played';

  return (
    <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
      <MusicNote size={16} weight="duotone" />
      <span className="font-medium text-gray-700 dark:text-gray-300">{label}:</span>
      <a
        href={track.url}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-accent dark:hover:text-accent-light transition-colors"
      >
        {track.artist.name || track.artist['#text']} – {track.name}
      </a>
    </div>
  );
}
