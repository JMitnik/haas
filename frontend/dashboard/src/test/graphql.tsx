import { graphql as baseGraphql } from 'msw';

export const graphql = baseGraphql.link('http://localhost:4000/graphql');
