import { useEffect, useState } from "react";
import { getSummary, whatpmUrl, type Summary } from "../lib/whatpm";

// Spine styles follow the theme: mostly greys, one in the accent
const SPINES = [
  "bg-accent text-white",
  "bg-ink text-paper",
  "bg-panel-2 text-ink ring-1 ring-inset ring-line-strong",
  "bg-ink-faint text-paper",
  "bg-panel-2 text-ink ring-1 ring-inset ring-line-strong",
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
      className="text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink"
    >
      what.pm
    </a>
  );

  return (
    <div className="flex h-full flex-col gap-6 sm:flex-row sm:items-end">
      <div className="sm:w-2/5">
        <h3 className="mb-6 font-medium tracking-[-0.01em]">Reading</h3>
        {summary || failed ? (
          <p className="text-gradient text-7xl leading-none font-semibold tracking-[-0.05em] tabular-nums">
            {summary ? summary.counts.books : "–"}
          </p>
        ) : (
          <div className="h-[4.5rem] w-28 animate-pulse rounded-xl bg-line" />
        )}
        {summary ? (
          <p className="mt-3 text-sm text-ink-soft">
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
          className="flex h-44 items-end gap-1.5 border-b border-line-strong px-2"
          aria-label={books.length ? "Most recently finished books" : undefined}
        >
          {books.map((book, i) => {
            return (
              <li
                key={`${book.title}-${book.author}`}
                className={`group relative flex flex-1 cursor-default justify-center rounded-t-[4px] pt-3 transition-transform duration-300 hover:-translate-y-2 ${SPINES[i % SPINES.length]}`}
                style={{ height: `${spineHeight(book.title)}%` }}
                tabIndex={0}
                aria-label={`${book.title} by ${book.author}`}
              >
                <span className="truncate text-xs font-medium [writing-mode:vertical-rl]">
                  {book.title}
                </span>
                <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-max max-w-44 -translate-x-1/2 rounded-md border border-line bg-panel px-2.5 py-1 text-xs text-ink opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus:opacity-100">
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
