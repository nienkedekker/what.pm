import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Helper to generate clean IDs (strips /index from folder-based content)
const generateId = ({ entry }: { entry: string }) => {
  return entry.replace(/\/index\.mdx$/, '').replace(/\.mdx$/, '');
};

const trips = defineCollection({
  loader: glob({
    pattern: '**/*.mdx',
    base: './src/content/trips',
    generateId,
  }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date(),
    location: z.string(),
    cover: image().optional(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().default(false),
  }),
});

const notes = defineCollection({
  loader: glob({
    pattern: '**/*.mdx',
    base: './src/content/notes',
    generateId,
  }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date(),
    cover: image().optional(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { trips, notes };
