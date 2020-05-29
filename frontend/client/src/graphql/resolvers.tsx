import { ApolloCache } from 'apollo-cache';
import gql from 'graphql-tag';

type ResolverFn = (
  parent: any,
  args: any,
  { cache } : { cache: ApolloCache<any> }
) => any;

interface ResolverMap {
  [field: string]: ResolverFn
}

export const resolvers = {};
