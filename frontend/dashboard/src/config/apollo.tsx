import ApolloClient from 'apollo-boost';

const client = new ApolloClient({
  uri: process.env.REACT_APP_API_ENDPOINT || 'http://localhost:4000/graphql',
});

export default client;
