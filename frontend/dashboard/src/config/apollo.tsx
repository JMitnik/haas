import ApolloClient, { Operation } from 'apollo-boost';
import { InMemoryCache } from 'apollo-cache-inmemory';

const client = new ApolloClient({
  uri: process.env.REACT_APP_API_ENDPOINT || 'http://localhost:4000/graphql',
  request: (operation: Operation) => {
    // TODO: Get from cookie instead
    const token = localStorage.getItem('token');

    // TODO: Deal with JSON parsing
    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${JSON.parse(token)}` : '',
      },
    });
  },
  cache: new InMemoryCache(),
});

export default client;
