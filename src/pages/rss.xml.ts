import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const trips = await getCollection('trips', ({ data }) => !data.draft);
  const notes = await getCollection('notes', ({ data }) => !data.draft);

  const allPosts = [
    ...trips.map((trip) => ({
      title: trip.data.title,
      pubDate: trip.data.date,
      description: trip.data.description || `Trip to ${trip.data.location}`,
      link: `/trips/${trip.id}`,
    })),
    ...notes.map((note) => ({
      title: note.data.title,
      pubDate: note.data.date,
      description: note.data.description || '',
      link: `/notes/${note.id}`,
    })),
  ].sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

  return rss({
    title: 'Nienke Dekker',
    description: 'Digital garden of Nienke Dekker - travels and notes',
    site: context.site || 'https://nienke.dev',
    items: allPosts,
    customData: '<language>en-us</language>',
  });
}
