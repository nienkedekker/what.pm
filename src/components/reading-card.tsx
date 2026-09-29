import { useEffect, useState } from "react";
import { getSummary, whatpmUrl, type Summary } from "../lib/whatpm";

const SPINES = [
  { background: "#2b35ff", color: "#fff" },
  { background: "#111114", color: "#fff" },
  { background: "#c6f432", color: "#111114" },
  { background: "#d9d9df", color: "#111114" },
  { background: "#9aa0ff", color: "#111114" },
];

// Stable spine height per title, so the shelf doesn't jump between renders
function spineHeight(title: string) {
  const hash = [...title].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return 76 + (hash % 25);
}

export default function ReadingCard() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    getSummary()
      .then(setSummary)
      .catch(() => setFailed(true));
  }, []);

  const books = summary?.recent.books ?? [];
  const logLink = (
    <a
      href={summary?.url ?? whatpmUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="text-ink underline decoration-accent decoration-[1.5px] underline-offset-4 hover:text-accent"
    >
      what.pm
    </a>
  );

  return (
    <div className="flex h-full flex-col gap-6 sm:flex-row sm:items-end">
      <div className="sm:w-2/5">
        {summary || failed ? (
          <p className="font-display text-8xl leading-none font-bold tracking-[-0.05em] text-accent">
            {summary ? summary.counts.books : "–"}
          </p>
        ) : (
          <div className="h-24 w-32 animate-pulse rounded-2xl bg-line" />
        )}
        {summary ? (
          <p className="mt-3 text-ink-soft">
            books read in {summary.year} so far. These are the latest few, straight from {logLink}.
          </p>
        ) : failed ? (
          <p className="mt-3 text-ink-soft">
            Couldn't reach my reading log right now. It lives on {logLink}.
          </p>
        ) : (
          <p className="mt-3 text-ink-faint">Checking my reading log…</p>
        )}
      </div>

      <div className="flex-1">
        <ul
          className="flex h-44 items-end gap-1.5 border-b-2 border-ink px-2"
          aria-label={books.length ? "Most recently finished books" : undefined}
        >
          {books.map((book, i) => {
            const spine = SPINES[i % SPINES.length];
            return (
              <li
                key={`${book.title}-${book.author}`}
                className="group relative flex flex-1 cursor-default justify-center rounded-t-[3px] pt-3 transition-transform duration-300 hover:-translate-y-2"
                style={{ height: `${spineHeight(book.title)}%`, ...spine }}
                tabIndex={0}
                aria-label={`${book.title} by ${book.author}`}
              >
                <span className="truncate font-display text-sm font-semibold [writing-mode:vertical-rl]">
                  {book.title}
                </span>
                <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-max max-w-44 -translate-x-1/2 rounded-full bg-ink px-3 py-1 font-mono text-[0.7rem] text-paper opacity-0 transition-opacity group-hover:opacity-100 group-focus:opacity-100">
                  {book.author}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
