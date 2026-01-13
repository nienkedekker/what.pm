import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { sanityClient } from "sanity:client";
import { tripsQuery, notesQuery } from "../sanity/queries";

export async function GET(context: APIContext) {
  const trips = await sanityClient.fetch(tripsQuery);
  const notes = await sanityClient.fetch(notesQuery);

  const allPosts = [
    ...trips.map((trip: any) => ({
      title: trip.title,
      pubDate: new Date(trip.date),
      description: trip.description || `Trip to ${trip.location}`,
      link: `/trips/${trip.slug.current}`,
    })),
    ...notes.map((note: any) => ({
      title: note.title,
      pubDate: new Date(note.date),
      description: note.description || "",
      link: `/notes/${note.slug.current}`,
    })),
  ].sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

  return rss({
    title: "Nienke Dekker",
    description: "Digital garden of Nienke Dekker - travels and notes",
    site: context.site || "https://nienke.dev",
    items: allPosts,
    customData: "<language>en-us</language>",
  });
}
