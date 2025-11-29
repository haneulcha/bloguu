import { config, fields, collection } from '@keystatic/core';

export default config({
  storage: {
    kind: 'github',
    repo: {
      owner: 'haneulcha',
      name: 'bloguu',
    },
  },
  collections: {
    posts: collection({
      label: 'Posts',
      slugField: 'title',
      path: 'src/content/posts/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        description: fields.text({ label: 'Description' }),
        pubDate: fields.date({
          label: 'Publication Date',
          defaultValue: { kind: 'today' }
        }),
        updatedDate: fields.date({
          label: 'Updated Date',
          defaultValue: { kind: 'today' }
        }),
        postType: fields.select({
          label: 'Post Type',
          options: [
            { label: 'Article (일상/단순 글)', value: 'article' },
            { label: 'Dev (개발 관련)', value: 'dev' },
            { label: 'Guide (지식/튜토리얼)', value: 'guide' },
            { label: 'Review (리뷰)', value: 'review' },
            { label: 'Creation (만든 것들)', value: 'creation' },
          ],
          defaultValue: 'article',
        }),
        tags: fields.array(
          fields.text({ label: 'Tag' }),
          {
            label: 'Tags',
            itemLabel: props => props.value
          }
        ),
        heroImage: fields.image({
          label: 'Hero Image',
          directory: 'src/assets/images/posts',
          publicPath: '@assets/images/posts/',
        }),
        // Review-specific fields (postType = 'review'일 때 사용)
        target: fields.select({
          label: 'Review Target (리뷰일 때만)',
          options: [
            { label: 'Film', value: 'film' },
            { label: 'TV Episode', value: 'tv-episode' },
            { label: 'TV Series', value: 'tv-series' },
            { label: 'YouTube', value: 'youtube' },
            { label: 'Cosmetic', value: 'cosmetic' },
            { label: 'Book', value: 'book' },
            { label: 'Article', value: 'article' },
          ],
          defaultValue: 'film',
        }),
        rating: fields.number({
          label: 'Rating (리뷰일 때만, 0-10)',
          validation: { min: 0, max: 10 },
          defaultValue: 0,
        }),
        reviewedAt: fields.date({
          label: 'Reviewed At (리뷰일 때만)',
          defaultValue: { kind: 'today' }
        }),
        // TV episode specific (target = 'tv-episode'일 때만)
        season: fields.number({
          label: 'Season (TV 에피소드일 때만)',
        }),
        episodeNumber: fields.number({
          label: 'Episode Number (TV 에피소드일 때만)',
        }),
        seriesTitle: fields.text({
          label: 'Series Title (TV 에피소드일 때만)',
        }),
        // Creation-specific fields (postType = 'creation'일 때 사용)
        creationType: fields.select({
          label: 'Creation Type (만든 것일 때만)',
          options: [
            { label: 'Knitting', value: 'knitting' },
            { label: 'Beading', value: 'beading' },
            { label: 'Sewing', value: 'sewing' },
            { label: 'Other', value: 'other' },
          ],
          defaultValue: 'other',
        }),
        content: fields.mdx({
          label: 'Content',
          options: {
            image: {
              directory: 'src/assets/images/posts',
              publicPath: '@assets/images/posts/',
            },
          },
        }),
      },
    }),
  },
});
