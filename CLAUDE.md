# Content Model Architecture

## 데이터 모델 구조

### 컨텐츠 타입

모든 콘텐츠는 `src/content/posts/` 디렉토리에 통합 관리되며, `postType` 필드로 구분됩니다.

1. **article**: 일상/단순 글
2. **dev**: 개발 관련 글
3. **guide**: 지식/튜토리얼
4. **review**: 리뷰 (영화, TV, 제품, 책 등)
5. **creation**: 만든 것들 (뜨개질, 비즈공예, 재봉 등)

### 타입별 스키마

#### Base Schema (모든 글 공통)
```typescript
{
  title: string
  description?: string
  pubDate: date
  updatedDate?: date
  tags?: string[]
  heroImage?: string
  relatedPosts?: reference('posts')[]
}
```

#### Article
```typescript
{
  ...baseSchema,
  postType: 'article'
}
```

#### Dev
```typescript
{
  ...baseSchema,
  postType: 'dev'
}
```

#### Guide
```typescript
{
  ...baseSchema,
  postType: 'guide'
}
```

#### Review
```typescript
{
  ...baseSchema,
  postType: 'review',
  target: 'film' | 'tv-episode' | 'tv-series' | 'youtube' | 'cosmetic' | 'book' | 'article',
  rating: number, // 0-10
  reviewedAt: date,
  // TV episode specific (optional)
  season?: number,
  episodeNumber?: number,
  seriesTitle?: string
}
```

#### Creation
```typescript
{
  ...baseSchema,
  postType: 'creation',
  creationType: 'knitting' | 'beading' | 'sewing' | 'other'
}
```

## 파일 구조

```
src/content/
└── posts/              # 모든 콘텐츠 통합 관리
    ├── 2023-05-27.mdx
    ├── 2024-05-06.mdx
    ├── 2025-03-02.mdx
    ├── 2025-03-03.mdx
    ├── 2025-07-31.mdx
    ├── 2025-11-29-daiso-beads.mdx
    ├── 2024-03-23-robot-dreams.mdx
    ├── 12-05-bobs-burgers.mdx
    └── using-mdx.mdx
```

## Astro Content Config

**파일**: `src/content.config.ts`

- Zod discriminated union을 사용한 타입 안전성 확보
- 단일 `posts` collection으로 모든 콘텐츠 관리

```typescript
import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

const baseSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  tags: z.array(z.string()).optional(),
  heroImage: z.string().optional(),
  relatedPosts: z.array(reference('posts')).optional(),
});

const posts = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx,mdoc}', base: './src/content/posts' }),
  schema: z.discriminatedUnion('postType', [
    baseSchema.extend({ postType: z.literal('article') }),
    baseSchema.extend({ postType: z.literal('dev') }),
    baseSchema.extend({ postType: z.literal('guide') }),
    baseSchema.extend({
      postType: z.literal('review'),
      target: z.enum(['film', 'tv-episode', 'tv-series', 'youtube', 'cosmetic', 'book', 'article']),
      rating: z.number().min(0).max(10),
      reviewedAt: z.coerce.date(),
      season: z.number().optional(),
      episodeNumber: z.number().optional(),
      seriesTitle: z.string().optional(),
    }),
    baseSchema.extend({
      postType: z.literal('creation'),
      creationType: z.enum(['knitting', 'beading', 'sewing', 'other']),
    }),
  ]),
});

export const collections = { posts };
```

## Keystatic CMS Config

**파일**: `keystatic.config.ts`

- 단일 `posts` collection
- `postType` select 필드로 글 타입 구분
- 타입별 필드는 레이블로 사용 조건 명시

```typescript
collections: {
  posts: collection({
    label: 'Posts',
    slugField: 'title',
    path: 'src/content/posts/*',
    schema: {
      // Base fields
      title: fields.slug({ name: { label: 'Title' } }),
      description: fields.text({ label: 'Description' }),
      pubDate: fields.date({ defaultValue: { kind: 'today' } }),
      updatedDate: fields.date({ defaultValue: { kind: 'today' } }),
      postType: fields.select({
        options: [
          { label: 'Article (일상/단순 글)', value: 'article' },
          { label: 'Dev (개발 관련)', value: 'dev' },
          { label: 'Guide (지식/튜토리얼)', value: 'guide' },
          { label: 'Review (리뷰)', value: 'review' },
          { label: 'Creation (만든 것들)', value: 'creation' },
        ],
        defaultValue: 'article',
      }),
      tags: fields.array(fields.text({ label: 'Tag' })),
      heroImage: fields.image({
        directory: 'src/assets/images/posts',
        publicPath: '@assets/images/posts/',
      }),

      // Review-specific fields
      target: fields.select({ label: 'Review Target (리뷰일 때만)', ... }),
      rating: fields.number({ label: 'Rating (리뷰일 때만, 0-10)', ... }),
      reviewedAt: fields.date({ label: 'Reviewed At (리뷰일 때만)', ... }),
      season: fields.number({ label: 'Season (TV 에피소드일 때만)' }),
      episodeNumber: fields.number({ label: 'Episode Number (TV 에피소드일 때만)' }),
      seriesTitle: fields.text({ label: 'Series Title (TV 에피소드일 때만)' }),

      // Creation-specific fields
      creationType: fields.select({ label: 'Creation Type (만든 것일 때만)', ... }),

      content: fields.mdx({ ... }),
    },
  }),
}
```

## 콘텐츠 쿼리 패턴

### 기본 쿼리

```typescript
import { getCollection } from 'astro:content';

// 모든 글
const allPosts = await getCollection('posts');

// 타입별 필터링
const articles = await getCollection('posts', ({ data }) => data.postType === 'article');
const devPosts = await getCollection('posts', ({ data }) => data.postType === 'dev');
const guides = await getCollection('posts', ({ data }) => data.postType === 'guide');
const reviews = await getCollection('posts', ({ data }) => data.postType === 'review');
const creations = await getCollection('posts', ({ data }) => data.postType === 'creation');
```

### 리뷰 타입별 쿼리

```typescript
// 영화 리뷰
const filmReviews = await getCollection('posts', ({ data }) =>
  data.postType === 'review' && data.target === 'film'
);

// TV 에피소드 리뷰
const tvReviews = await getCollection('posts', ({ data }) =>
  data.postType === 'review' && data.target === 'tv-episode'
);

// 특정 시리즈의 모든 에피소드
const bobsBurgers = await getCollection('posts', ({ data }) =>
  data.postType === 'review' &&
  data.target === 'tv-episode' &&
  data.seriesTitle === "Bob's Burgers"
);

// 코스메틱 리뷰
const cosmeticReviews = await getCollection('posts', ({ data }) =>
  data.postType === 'review' && data.target === 'cosmetic'
);
```

### 복합 쿼리

```typescript
// 개발 + 가이드 (기술 글)
const technicalPosts = await getCollection('posts', ({ data }) =>
  ['dev', 'guide'].includes(data.postType)
);

// 모든 미디어 리뷰 (영화, TV)
const mediaReviews = await getCollection('posts', ({ data }) =>
  data.postType === 'review' &&
  ['film', 'tv-episode', 'tv-series'].includes(data.target)
);

// 특정 태그
const musicPosts = await getCollection('posts', ({ data }) =>
  data.tags?.includes('music')
);

// 최근 글 (모든 타입, 날짜순)
const recentPosts = allPosts
  .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime())
  .slice(0, 10);

// 평점 높은 리뷰
const topRatedReviews = await getCollection('posts', ({ data }) =>
  data.postType === 'review' && data.rating >= 8
);
```

## Git Hooks

### Pre-commit Hook

**파일**: `.git/hooks/pre-commit`

- `src/content/posts/` 디렉토리의 MDX 파일 감지
- 커밋 시 `updatedDate` 자동으로 오늘 날짜로 갱신

```bash
#!/bin/bash

TODAY=$(date +%Y-%m-%d)
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E '^src/content/posts/.+\.mdx$')

if [ -z "$STAGED_FILES" ]; then
  exit 0
fi

for FILE in $STAGED_FILES; do
  if [ -f "$FILE" ]; then
    if grep -q "^updatedDate:" "$FILE"; then
      sed -i '' "s/^updatedDate:.*/updatedDate: $TODAY/" "$FILE"
      git add "$FILE"
      echo "Updated updatedDate in $FILE to $TODAY"
    fi
  fi
done

exit 0
```

## UI 필터링 시나리오

이 구조로 구현 가능한 뷰들:

1. **홈**: 모든 글을 날짜순 정렬
2. **카테고리별**:
   - 일상 (postType: article)
   - 개발 블로그 (postType: dev)
   - 지식/튜토리얼 (postType: guide)
   - 리뷰 (postType: review)
   - 만든 것들 (postType: creation)
3. **리뷰 타입별**:
   - 영화/TV (target: film, tv-episode, tv-series)
   - 제품 (target: cosmetic)
   - 책/글 (target: book, article)
4. **특정 시리즈**: Bob's Burgers 등
5. **태그별**: 기존과 동일
6. **평점순**: 리뷰만 필터 후 정렬

## 장점

1. **단순한 쿼리**: 단일 collection에서 filter 사용
2. **타입 안전성**: TypeScript discriminated union
3. **확장성**: 새 postType 추가만으로 기능 확장
4. **혼합 뷰**: "최근 글 전체" 같은 뷰 구현 용이
5. **파일 관리**: 모든 콘텐츠가 한 곳에 집중
6. **UI 유연성**: 동적 필터링/정렬/그룹핑 자유로움
