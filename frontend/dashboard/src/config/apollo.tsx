import { createUploadLink } from 'apollo-upload-client';

import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';

const client = new ApolloClient({
  link: createUploadLink({
    uri: process.env.REACT_APP_API_ENDPOINT || 'http://localhost:4000/graphql',
    headers: {
      authorization: localStorage.getItem('token'),
    },
  }),
  cache: new InMemoryCache(),
});

export default client;
