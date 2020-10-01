import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache, NormalizedCacheObject, defaultDataIdFromObject } from 'apollo-cache-inmemory';
import { toIdValue } from 'apollo-utilities';

const cache: InMemoryCache = new InMemoryCache({
  dataIdFromObject: defaultDataIdFromObject,
  cacheRedirects: {
    Query: {
      dialogue: (_, args) => (
        toIdValue(defaultDataIdFromObject({ __typename: 'Dialogue', id: args?.id }) || '')
      ),
      dialogues: (_, args) => (
        args.ids.map((id: any) => (
          toIdValue(defaultDataIdFromObject({ __typename: 'Dialogue', id: id?.id }) || '')
        ))
      ),
      questions: (_, args) => (
        args.ids.map((id: any) => (
          toIdValue(defaultDataIdFromObject({ __typename: 'QuestionNode', id: id?.id }) || '')
        ))
      ),
      question: (_, args) => (
        toIdValue(defaultDataIdFromObject({ __typename: 'QuestionNode', id: args?.id }) || '')),
      questionNode: (_, args) => (
        toIdValue(defaultDataIdFromObject({ __typename: 'QuestionNode', id: args?.id }) || '')),
      edge: (_, args) => (
        toIdValue(defaultDataIdFromObject({ __typename: 'Edge', id: args?.id }) || '')),
      edges: (_, args) => (
        args.ids.map((id: any) => (
          toIdValue(defaultDataIdFromObject({ __typename: 'Edge', id: id?.id }) || '')
        ))
      ),
    },
  },
});

const link = new HttpLink({
  uri: process.env.REACT_APP_API_ENDPOINT || 'http://localhost:4000/graphql',
});

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache,
  link,
});

console.log('client: ', client);

export default client;
