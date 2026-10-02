// My latest scrobble on Last.fm, for the listening card on the home page.
// The API key is a public, read-only one.

export interface Track {
  name: string;
  url: string;
  artist: { name?: string; "#text"?: string };
  image?: { size: string; "#text": string }[];
  date?: { uts: string };
  "@attr"?: { nowplaying: string };
}

const RECENT_TRACKS =
  "https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=shinyhats&api_key=54f8f15133336606e882fdf20148d123&limit=1&format=json";

// Resolves to null when nothing has been played yet
export async function getLatestTrack(signal?: AbortSignal): Promise<Track | null> {
  const res = await fetch(RECENT_TRACKS, { signal });
  if (!res.ok) throw new Error(`Last.fm responded ${res.status}`);
  const data = await res.json();
  return data?.recenttracks?.track?.[0] || null;
}

// A track fetched while building the page is only ever "last played": by the
// time anyone sees it, it has probably stopped
export function asLastPlayed(track: Track): Track {
  const rest = { ...track };
  delete rest["@attr"];
  return rest;
}
