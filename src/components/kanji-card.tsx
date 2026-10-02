import { useEffect, useRef, useState } from "react";
import { keepShown, type Kanji, type Progress } from "../lib/wanikani";

// Live from /api/wanikani: kanji I've actually learned on WaniKani. `initial`
// is fetched while the page is built; the card refreshes it on load.
export default function KanjiCard({ initial }: { initial?: Progress }) {
  const [progress, setProgress] = useState<Progress | null>(initial ?? null);
  const [failed, setFailed] = useState(false);
  const [index, setIndex] = useState(0);
  const charRef = useRef<HTMLSpanElement>(null);
  const shownRef = useRef<Kanji | undefined>(undefined);

  const sample = progress?.sample ?? [];
  const current = sample[index];

  useEffect(() => {
    shownRef.current = current;
  });

  useEffect(() => {
    fetch("/api/wanikani")
      .then((res) => {
        if (!res.ok) throw new Error(`WaniKani route responded ${res.status}`);
        return res.json();
      })
      .then((fresh: Progress) => {
        setProgress(keepShown(fresh, shownRef.current));
        setIndex(0);
      })
      .catch(() => setFailed(true));
  }, []);

  const next = () => {
    if (sample.length < 2) return;
    setIndex((i) => (i + 1) % sample.length);
    charRef.current?.animate(
      [
        { opacity: 0, filter: "blur(6px)" },
        { opacity: 1, filter: "blur(0)" },
      ],
      { duration: 350, easing: "cubic-bezier(0.2, 0.7, 0.2, 1)" }
    );
  };

  const percent = progress ? Math.round((progress.kanji.learned / progress.kanji.total) * 100) : 0;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-medium tracking-[-0.01em]">Learning Japanese</h3>
        {progress && <span className="text-xs text-ink-soft">WaniKani level {progress.level}</span>}
      </div>

      <button
        type="button"
        onClick={next}
        disabled={!current}
        aria-label="Show another kanji I've learned"
        className="group my-8 flex flex-1 flex-col items-center justify-center text-center"
      >
        {current ? (
          <>
            <span
              ref={charRef}
              lang="ja"
              className="font-jp text-[7.5rem] leading-none font-medium text-ink"
            >
              {current.char}
            </span>
            <span lang="ja" className="mt-6 font-jp text-accent">
              {current.reading}
            </span>
            <span className="mt-1 text-sm text-ink-soft" aria-live="polite">
              {current.meaning}
            </span>
            <span className="mt-4 text-xs text-ink-faint opacity-0 transition-opacity group-hover:opacity-100">
              Click for another
            </span>
          </>
        ) : failed ? (
          <span className="text-sm text-ink-faint">Couldn't reach WaniKani right now.</span>
        ) : (
          <span className="size-28 animate-pulse rounded-2xl bg-line" />
        )}
      </button>

      <div>
        <div className="flex items-baseline justify-between gap-3 text-sm">
          <span className="text-ink-soft">Kanji learned</span>
          {progress && (
            <span className="whitespace-nowrap tabular-nums">
              {progress.kanji.learned.toLocaleString("en-US")}{" "}
              <span className="text-ink-faint">
                / {progress.kanji.total.toLocaleString("en-US")}
              </span>
            </span>
          )}
        </div>
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-line">
          <div
            className="h-full rounded-full bg-accent transition-[width] duration-700"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
