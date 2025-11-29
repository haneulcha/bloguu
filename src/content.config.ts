import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx,mdoc}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    tags: z.array(z.string()).optional(),
    relatedPosts: z.array(reference('blog')).optional(),
  })
});

const film = defineCollection({
  loader: glob({
    pattern: '**/[^_]*.{md,mdx,mdoc}',
    base: './src/content/films',
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    watchedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).optional(),
    heroImage: z.string().optional(),
    relatedPosts: z.array(reference('blog')).optional(),
    rate: z.number().optional(),
  }),
});

const bobsBurgers = defineCollection({
  loader: glob({
    pattern: '**/[^_]*.{md,mdx,mdoc}',
    base: './src/content/bobs-burgers',
  }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    season: z.number(),
    episodeNumber: z.number(),
    rate: z.number(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
  }),
});

export const collections = { blog, 'bobs-burgers': bobsBurgers, film };