import { createUploadLink } from 'apollo-upload-client';

import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';

const client = new ApolloClient({
  link: createUploadLink({uri: process.env.REACT_APP_API_ENDPOINT || 'http://localhost:4000/graphql'}),
  cache: new InMemoryCache()
});

// import { ApolloClient } from 'apollo-boost';

// const client = new ApolloClient({
//   uri: process.env.REACT_APP_API_ENDPOINT || 'http://localhost:4000/graphql',
// });

export default client;
