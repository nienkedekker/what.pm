// Upstash Redis: the only runtime data on the site (guestbook + hit counter).
// Manage or delete entries in the Upstash console via Vercel → Storage.
import { Redis } from "@upstash/redis";
import { KV_REST_API_TOKEN, KV_REST_API_URL } from "astro:env/server";

const redis = new Redis({ url: KV_REST_API_URL, token: KV_REST_API_TOKEN });

const HITS_KEY = "site:hits";
const GUESTBOOK_KEY = "guestbook:entries";
// Keep the list from growing forever; the page shows the newest first
const GUESTBOOK_MAX = 1000;

export interface GuestbookEntry {
  id: string;
  name: string;
  website?: string;
  message: string;
  createdAt: string;
}

export function getHits() {
  return redis.get<number>(HITS_KEY).then((hits) => hits ?? 0);
}

export function incrementHits() {
  return redis.incr(HITS_KEY);
}

/** Newest first */
export function getGuestbookEntries() {
  return redis.lrange<GuestbookEntry>(GUESTBOOK_KEY, 0, GUESTBOOK_MAX - 1);
}

export async function addGuestbookEntry(entry: Omit<GuestbookEntry, "id" | "createdAt">) {
  const saved: GuestbookEntry = {
    ...entry,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  await redis
    .pipeline()
    .lpush(GUESTBOOK_KEY, saved)
    .ltrim(GUESTBOOK_KEY, 0, GUESTBOOK_MAX - 1)
    .exec();
  return saved;
}
