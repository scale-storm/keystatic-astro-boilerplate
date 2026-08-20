import { config, fields, collection, singleton } from '@keystatic/core';

const repo = import.meta.env?.PUBLIC_GITHUB_REPO as `${string}/${string}`;

export default config({
  storage: {
    kind: 'github',
    repo,
  },
  singletons: {
    home: singleton({
      label: 'Home page',
      path: 'src/content/home',
      previewUrl: '/preview?branch={branch}',
      schema: {
        heading: fields.text({ label: 'Heading' }),
        tagline: fields.text({ label: 'Tagline', multiline: true }),
      },
    }),
  },
  collections: {
    posts: collection({
      label: 'Posts',
      slugField: 'title',
      path: 'src/content/posts/*',
      format: { contentField: 'content' },
      previewUrl: '/preview/posts/{slug}?branch={branch}',
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        content: fields.markdoc({
          label: 'Content',
          options: {
            image: {
              directory: 'src/assets/images/posts',
              publicPath: '../../assets/images/posts/',
            },
          },
        }),
      },
    }),
  },
});
