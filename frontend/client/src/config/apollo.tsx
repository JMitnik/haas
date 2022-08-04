import { ApolloClient, HttpLink, InMemoryCache, NormalizedCacheObject } from '@apollo/client';

const cache: InMemoryCache = new InMemoryCache();

const link = new HttpLink({
  uri: process.env.VITE_API_ENDPOINT || 'http://localhost:4000/graphql',
});

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache,
  link,
});

export default client;
