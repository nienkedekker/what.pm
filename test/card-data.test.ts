import { test } from "node:test";
import assert from "node:assert/strict";
import { asLastPlayed, type Track } from "../src/lib/lastfm.ts";
import { keepShown, type Progress } from "../src/lib/wanikani.ts";

const kanji = (char: string) => ({ char, meaning: char, reading: char });

const fresh: Progress = {
  level: 22,
  kanji: { learned: 720, burned: 100, total: 2087 },
  sample: [kanji("山"), kanji("川"), kanji("日")],
};

test("keepShown puts the kanji on screen first in the fresh sample", () => {
  const progress = keepShown(fresh, kanji("火"));
  assert.equal(progress.level, 22);
  assert.deepEqual(progress.kanji, fresh.kanji);
  assert.deepEqual(
    progress.sample.map(({ char }) => char),
    ["火", "山", "川", "日"]
  );
});

test("keepShown doesn't repeat a kanji that is in both samples", () => {
  assert.deepEqual(
    keepShown(fresh, kanji("川")).sample.map(({ char }) => char),
    ["川", "山", "日"]
  );
});

test("keepShown uses the fresh sample as-is when nothing is shown yet", () => {
  assert.equal(keepShown(fresh, undefined), fresh);
});

test("asLastPlayed drops the now-playing flag and keeps the rest", () => {
  const track: Track = {
    name: "Diarabi",
    url: "https://www.last.fm/music/x",
    artist: { "#text": "Vieux Farka Touré" },
    "@attr": { nowplaying: "true" },
  };
  assert.deepEqual(asLastPlayed(track), {
    name: track.name,
    url: track.url,
    artist: track.artist,
  });
  assert.equal(track["@attr"]?.nowplaying, "true", "the original is untouched");
});
