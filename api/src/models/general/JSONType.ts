import { GraphQLJSONObject } from 'graphql-type-json';
import { scalarType } from '@nexus/schema';

const JSONScalar = scalarType({
  name: 'JSON',
  serialize: GraphQLJSONObject.serialize,
  parseValue: GraphQLJSONObject.parseValue,
  parseLiteral: GraphQLJSONObject.parseLiteral,
});

export default JSONScalar;
