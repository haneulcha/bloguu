import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Base schema for all posts
const baseSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  tags: z.array(z.string()).optional(),
  heroImage: z.string().optional(),
  relatedPosts: z.array(reference('posts')).optional(),
});

// Post type discriminated union
const posts = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx,mdoc}', base: './src/content/posts' }),
  schema: z.discriminatedUnion('postType', [
    // Article (일상/단순 글)
    baseSchema.extend({
      postType: z.literal('article'),
    }),

    // Dev (개발 관련)
    baseSchema.extend({
      postType: z.literal('dev'),
    }),

    // Guide (지식/튜토리얼)
    baseSchema.extend({
      postType: z.literal('guide'),
    }),

    // Review (리뷰)
    baseSchema.extend({
      postType: z.literal('review'),
      target: z.enum([
        'film',
        'tv-episode',
        'tv-series',
        'youtube',
        'cosmetic',
        'book',
        'article',
      ]),
      rating: z.number().min(0).max(10),
      reviewedAt: z.coerce.date(),
      // TV episode specific fields (optional)
      season: z.number().optional(),
      episodeNumber: z.number().optional(),
      seriesTitle: z.string().optional(),
    }),

    // Creation (핸드메이드)
    baseSchema.extend({
      postType: z.literal('creation'),
      creationType: z.enum(['knitting', 'beading', 'sewing', 'other']),
    }),
  ]),
});

export const collections = { posts };