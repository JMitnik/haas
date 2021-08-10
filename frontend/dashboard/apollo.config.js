module.exports = {
  client: {
    service: {
      name: 'haas',
      url: 'http://localhost:4000/graphql',
    },
    excludes: ['src/types/generated-types.ts'], // array of glob patterns
  },
};
