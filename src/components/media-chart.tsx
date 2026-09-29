import { useEffect, useState } from "react";
import { getSummary, whatpmUrl, type Summary } from "../lib/whatpm";

// Categorical order is fixed: books, movies, TV. Validated for CVD separation
// and contrast against the light and dark card surfaces.
const SERIES = [
  { key: "books", label: "Books", noun: "books", swatch: "bg-[#2b35ff] dark:bg-[#6b73ff]" },
  { key: "movies", label: "Movies", noun: "movies", swatch: "bg-[#eb6834] dark:bg-[#d95926]" },
  {
    key: "shows",
    label: "TV seasons",
    noun: "TV seasons",
    swatch: "bg-[#1baf7a] dark:bg-[#199e70]",
  },
] as const;

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Round the y-axis up to a clean number, with a tick every 5 (or 10)
function niceScale(max: number) {
  const step = max > 30 ? 10 : 5;
  const top = Math.max(step, Math.ceil(max / step) * step);
  const ticks = Array.from({ length: top / step + 1 }, (_, i) => i * step);
  return { top, ticks };
}

function describe(month: Summary["months"][number]) {
  return SERIES.map(({ key, noun }) => `${month[key]} ${noun}`).join(", ");
}

export default function MediaChart() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    getSummary()
      .then(setSummary)
      .catch(() => setFailed(true));
  }, []);

  const now = new Date();
  const lastMonth = summary && summary.year === now.getFullYear() ? now.getMonth() + 1 : 12;
  const months = summary?.months ?? [];
  const totals = months.map((m) => m.books + m.movies + m.shows);
  const { top, ticks } = niceScale(Math.max(0, ...totals));
  const peak = totals.indexOf(Math.max(...totals));

  return (
    <div className="flex h-full flex-col">
      <h3 className="font-display text-3xl leading-[1.05] font-bold tracking-[-0.03em] sm:text-4xl">
        {summary ? `${summary.year}, month by month` : "This year, month by month"}
      </h3>
      <p className="mt-2 max-w-md text-ink-soft">
        Everything I've read and watched, as logged on{" "}
        <a
          href={summary?.url ?? whatpmUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-ink underline decoration-accent decoration-[1.5px] underline-offset-4 hover:text-accent"
        >
          what.pm
        </a>
        .
      </p>

      {/* Legend: always present, with this year's totals */}
      <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-1 text-sm">
        {SERIES.map(({ key, label, swatch }) => (
          <li key={key} className="flex items-center gap-2">
            <span className={`size-2.5 rounded-[3px] ${swatch}`} aria-hidden="true" />
            <span className="text-ink-soft">{label}</span>
            {summary && <span className="font-medium tabular-nums">{summary.counts[key]}</span>}
          </li>
        ))}
      </ul>

      {failed ? (
        <p className="mt-auto pt-8 text-ink-soft">Couldn't reach what.pm right now.</p>
      ) : (
        <div className="mt-auto flex gap-3 pt-8">
          {/* Y-axis */}
          <div className="relative h-40 w-5 shrink-0 text-right text-[0.7rem] text-ink-faint tabular-nums">
            {summary &&
              ticks.map((tick) => (
                <span
                  key={tick}
                  className="absolute right-0 translate-y-1/2"
                  style={{ bottom: `${(tick / top) * 100}%` }}
                >
                  {tick}
                </span>
              ))}
          </div>

          <div className="flex-1">
            <div className="relative h-40">
              {/* Hairline gridlines */}
              {summary &&
                ticks.map((tick) => (
                  <span
                    key={tick}
                    className="absolute inset-x-0 h-px bg-line"
                    style={{ bottom: `${(tick / top) * 100}%` }}
                    aria-hidden="true"
                  />
                ))}

              <div className="absolute inset-0 flex" aria-hidden={!summary}>
                {MONTHS.map((name, i) => {
                  const month = months[i];
                  const total = totals[i] ?? 0;
                  const upcoming = i + 1 > lastMonth;
                  const segments = month
                    ? [...SERIES].reverse().filter(({ key }) => month[key] > 0)
                    : [];

                  if (!summary) {
                    return (
                      <div key={name} className="flex flex-1 items-end justify-center">
                        <span
                          className="w-full max-w-6 animate-pulse rounded-t-[4px] bg-line"
                          style={{ height: `${25 + ((i * 37) % 50)}%` }}
                        />
                      </div>
                    );
                  }

                  return (
                    <div
                      key={name}
                      className="group relative flex flex-1 items-end justify-center outline-none"
                      tabIndex={upcoming ? undefined : 0}
                      aria-label={upcoming ? undefined : `${name}: ${describe(month)}`}
                    >
                      {i === peak && total > 0 && (
                        <span
                          className="absolute text-[0.7rem] font-medium text-ink-soft tabular-nums"
                          style={{ bottom: `calc(${(total / top) * 100}% + 4px)` }}
                        >
                          {total}
                        </span>
                      )}
                      <div
                        className="flex w-full max-w-6 flex-col gap-[2px] transition-opacity group-hover:opacity-85"
                        style={{ height: `${(total / top) * 100}%` }}
                      >
                        {segments.map(({ key, swatch }, s) => (
                          <span
                            key={key}
                            className={`${swatch} ${s === 0 ? "rounded-t-[4px]" : ""}`}
                            style={{ flexGrow: month[key], flexBasis: 0 }}
                          />
                        ))}
                      </div>

                      {/* Hover / focus tooltip */}
                      {!upcoming && (
                        <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-max -translate-x-1/2 rounded-xl bg-ink px-3 py-2 text-xs text-paper opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                          <p className="mb-1 font-medium">{name}</p>
                          {SERIES.map(({ key, label, swatch }) => (
                            <p key={key} className="flex items-center gap-2">
                              <span className={`size-2 rounded-[2px] ${swatch}`} />
                              {label}
                              <span className="ml-auto pl-3 tabular-nums">{month[key]}</span>
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Month labels */}
            <div className="mt-2 flex text-[0.7rem] text-ink-faint" aria-hidden="true">
              {MONTHS.map((name, i) => (
                <span
                  key={name}
                  className={`flex-1 text-center ${i + 1 > lastMonth ? "opacity-40" : ""}`}
                >
                  {name[0]}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Table view for screen readers */}
      {summary && (
        <table className="sr-only">
          <caption>Books, movies and TV seasons logged per month in {summary.year}</caption>
          <thead>
            <tr>
              <th scope="col">Month</th>
              {SERIES.map(({ key, label }) => (
                <th key={key} scope="col">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {months.slice(0, lastMonth).map((month, i) => (
              <tr key={month.month}>
                <th scope="row">{MONTHS[i]}</th>
                {SERIES.map(({ key }) => (
                  <td key={key}>{month[key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
