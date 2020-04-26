import ApolloClient, { Operation } from 'apollo-boost';
import { InMemoryCache } from 'apollo-cache-inmemory';

const client = new ApolloClient({
  uri: process.env.REACT_APP_API_ENDPOINT || 'http://localhost:4000/graphql',
  request: (operation: Operation) => {
    const token = localStorage.getItem('token');
    operation.setContext({
      authorization: token ? `Bearer ${token}` : '',
    });
  },
  cache: new InMemoryCache(),
});

export default client;
