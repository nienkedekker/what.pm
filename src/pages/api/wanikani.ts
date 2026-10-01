// My WaniKani progress for the kanji card on the home page.
// The token stays on the server; responses are cached at the edge for an hour.
import type { APIRoute } from "astro";
import { WANIKANI_KEY } from "astro:env/server";

export const prerender = false;

const API = "https://api.wanikani.com/v2";
// SRS stage 5 is "Guru" — WaniKani's own "learned" threshold. 9 is "Burned".
const PASSED_STAGES = "5,6,7,8,9";
const SAMPLE_SIZE = 12;

interface Collection<T> {
  total_count: number;
  pages: { next_url: string | null };
  data: { id: number; data: T }[];
}

interface Assignment {
  subject_id: number;
  srs_stage: number;
}

interface KanjiSubject {
  characters: string;
  meanings: { meaning: string; primary: boolean }[];
  readings: { reading: string; primary: boolean }[];
}

async function wanikani<T>(url: string): Promise<T> {
  const res = await fetch(url.startsWith("http") ? url : `${API}${url}`, {
    headers: {
      Authorization: `Bearer ${WANIKANI_KEY}`,
      "Wanikani-Revision": "20170710",
    },
  });
  if (!res.ok) throw new Error(`WaniKani responded ${res.status} for ${url}`);
  return res.json();
}

// Follow pagination so counts and samples cover every page
async function allPages<T>(url: string) {
  const items: Collection<T>["data"] = [];
  let next: string | null = url;
  while (next) {
    const page: Collection<T> = await wanikani(next);
    items.push(...page.data);
    next = page.pages.next_url;
  }
  return items;
}

function pickRandom<T>(items: T[], count: number) {
  return [...items].sort(() => Math.random() - 0.5).slice(0, count);
}

const json = (body: unknown, status = 200, cache = true) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...(cache && {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      }),
    },
  });

export const GET: APIRoute = async () => {
  if (!WANIKANI_KEY) {
    return json({ error: "WaniKani isn't connected" }, 503, false);
  }

  try {
    const [user, passed, allKanji] = await Promise.all([
      wanikani<{ data: { level: number } }>("/user"),
      allPages<Assignment>(`/assignments?subject_types=kanji&srs_stages=${PASSED_STAGES}`),
      // Only the total is needed; the first page carries total_count
      wanikani<Collection<KanjiSubject>>("/subjects?types=kanji"),
    ]);

    const sampleIds = pickRandom(passed, SAMPLE_SIZE).map((a) => a.data.subject_id);
    const subjects = sampleIds.length
      ? await wanikani<Collection<KanjiSubject>>(`/subjects?ids=${sampleIds.join(",")}`)
      : { data: [] };

    return json({
      level: user.data.level,
      kanji: {
        learned: passed.length,
        burned: passed.filter((a) => a.data.srs_stage === 9).length,
        total: allKanji.total_count,
      },
      sample: subjects.data.map(({ data }) => ({
        char: data.characters,
        meaning: data.meanings.find((m) => m.primary)?.meaning ?? "",
        reading: data.readings.find((r) => r.primary)?.reading ?? "",
      })),
    });
  } catch (error) {
    console.error("WaniKani error:", error);
    return json({ error: "Couldn't reach WaniKani" }, 502, false);
  }
};
