import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { sanityClient } from "sanity:client";
import { tripsQuery, notesQuery } from "../sanity/queries";
import type { Trip, Note } from "../types/sanity";

export async function GET(context: APIContext) {
  const trips: Trip[] = await sanityClient.fetch(tripsQuery);
  const notes: Note[] = await sanityClient.fetch(notesQuery);

  const allPosts = [
    ...trips.map((trip) => ({
      title: trip.title,
      pubDate: new Date(trip.date),
      description: trip.description || `Trip to ${trip.location}`,
      link: `/trips/${trip.slug.current}`,
    })),
    ...notes.map((note) => ({
      title: note.title,
      pubDate: new Date(note.date),
      description: note.description || "",
      link: `/notes/${note.slug.current}`,
    })),
  ].sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

  return rss({
    title: "Nienke Dekker",
    description: "Nienke.dev RSS feed",
    site: context.site || "https://nienke.dev",
    items: allPosts,
    customData: "<language>en-us</language>",
  });
}
