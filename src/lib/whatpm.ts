// Client for my reading/watching log on what.pm (see /api/v1/summary in the
// what.pm repo). Several islands use it, so the request is shared.

const WHATPM_URL = import.meta.env.PUBLIC_WHATPM_URL || "https://www.what.pm";

export interface Book {
  title: string;
  author: string;
}

export interface MonthCounts {
  month: number;
  books: number;
  movies: number;
  shows: number;
}

export interface Summary {
  year: number;
  counts: { books: number; movies: number; shows: number };
  months: MonthCounts[];
  recent: { books: Book[] };
  url: string;
}

export const whatpmUrl = WHATPM_URL;

let request: Promise<Summary> | undefined;

export function getSummary() {
  request ??= fetch(`${WHATPM_URL}/api/v1/summary?limit=5`)
    .then((res) => {
      if (!res.ok) throw new Error(`what.pm responded ${res.status}`);
      return res.json() as Promise<Summary>;
    })
    .catch((error) => {
      // Let the next caller try again instead of reusing the failure
      request = undefined;
      throw error;
    });
  return request;
}
