import { config, fields, collection } from '@keystatic/core';

export default config({
  storage: {
    kind: 'github',
    repo: {
      owner: 'haneulcha', // GitHub 사용자명으로 수정 필요
      name: 'bloguu', // 리포지토리명으로 수정 필요
    },
  },
  collections: {
    blog: collection({
      label: 'Blog',
      slugField: 'title',
      path: 'src/content/blog/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        description: fields.text({ label: 'Description' }),
        pubDate: fields.date({ label: 'Publication Date' }),
        updatedDate: fields.date({
          label: 'Updated Date',
          defaultValue: { kind: 'today' }
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
          directory: 'src/assets/images/blog',
          publicPath: '@assets/images/blog/',
        }),
        content: fields.mdx({
          label: 'Content',
          options: {
            image: {
              directory: 'src/assets/images/blog',
              publicPath: '@assets/images/blog/',
            },
          },
        }),
      },
    }),
    films: collection({
      label: 'Films',
      slugField: 'title',
      path: 'src/content/films/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        description: fields.text({ label: 'Description' }),
        pubDate: fields.date({ label: 'Publication Date' }),
        watchedDate: fields.date({ label: 'Watched Date' }),
        rate: fields.number({
          label: 'Rating',
          validation: { min: 0, max: 10 }
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
          directory: 'src/assets/images/films',
          publicPath: '@assets/images/films/',
        }),
        content: fields.mdx({
          label: 'Content',
          options: {
            image: {
              directory: 'src/assets/images/films',
              publicPath: '@assets/images/films/',
            },
          },
        }),
      },
    }),
    'bobs-burgers': collection({
      label: "Bob's Burgers",
      slugField: 'title',
      path: 'src/content/bobs-burgers/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        description: fields.text({ label: 'Description', multiline: true }),
        season: fields.number({ label: 'Season' }),
        episodeNumber: fields.number({ label: 'Episode Number' }),
        rate: fields.number({
          label: 'Rating',
          validation: { min: 0, max: 10 }
        }),
        pubDate: fields.date({ label: 'Publication Date' }),
        content: fields.mdx({
          label: 'Content',
          options: {
            image: {
              directory: 'src/assets/images/bobs-burgers',
              publicPath: '@assets/images/bobs-burgers/',
            },
          },
        }),
      },
    }),
  },
});
