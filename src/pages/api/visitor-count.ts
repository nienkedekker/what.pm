import type { APIRoute } from "astro";
import { writeClient } from "@/sanity/writeClient.ts";

export const prerender = false;

const STATS_ID = "siteStats";

export const POST: APIRoute = async () => {
  try {
    // Try to increment existing counter
    const result = await writeClient
      .patch(STATS_ID)
      .setIfMissing({ hitCount: 0 })
      .inc({ hitCount: 1 })
      .commit();

    return new Response(JSON.stringify({ count: result.hitCount }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    // If document doesn't exist, create it
    const sanityError = error as { statusCode?: number };
    if (sanityError.statusCode === 404) {
      const doc = await writeClient.create({
        _id: STATS_ID,
        _type: "siteStats",
        hitCount: 1,
      });

      return new Response(JSON.stringify({ count: doc.hitCount }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.error("Hit counter error:", error);
    return new Response(JSON.stringify({ error: "Failed to update counter" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const GET: APIRoute = async () => {
  try {
    const stats = await writeClient.fetch(`*[_id == $id][0].hitCount`, { id: STATS_ID });

    return new Response(JSON.stringify({ count: stats ?? 0 }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Hit counter error:", error);
    return new Response(JSON.stringify({ count: 0 }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
};
