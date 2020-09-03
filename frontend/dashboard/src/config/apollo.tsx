import { createUploadLink } from 'apollo-upload-client';

import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';

const getHeader = () => {
  const auth = localStorage.getItem('auth');

  if (!auth) return null;

  return JSON.parse(auth).token;
};

const client = new ApolloClient({
  link: createUploadLink({
    uri: process.env.REACT_APP_API_ENDPOINT || 'http://localhost:4000/graphql',
    headers: {
      authorization: `Bearer:${getHeader()}`,
    },
  }),
  cache: new InMemoryCache(),
});

export default client;
