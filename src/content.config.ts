import { defineCollection, reference, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // Transform string to Date object
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).optional(),
    heroImage: z.string().optional(),
    relatedPosts: z.array(reference("blog")).optional(),
    isDraft: z.boolean().optional(),
  }),
});

const film = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.{md,mdx}",
    base: "./src/content/films",
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // Transform string to Date object
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    watchedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).optional(),
    heroImage: z.string().optional(),
    relatedPosts: z.array(reference("blog")).optional(),
    isDraft: z.boolean().optional(),
  }),
});

const bobsBurgers = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.{md,mdx}",
    base: "./src/content/bobs-burgers",
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

export const collections = { blog, "bobs-burgers": bobsBurgers, film };
