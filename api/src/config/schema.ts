import { makeSchema, asNexusMethod } from '@nexus/schema';
import path from 'path';
import { JSONObjectResolver } from 'graphql-scalars'

import { ParentResolvePlugin, TimeResolverPlugin, QueryCounterPlugin } from './graphql/plugins';
import nexus from './nexus';

const jsonScalar = asNexusMethod(JSONObjectResolver, 'json')

const schema = makeSchema({
  shouldGenerateArtifacts: process.env.NODE_ENV === 'development',
  types: [
    ...nexus,
    jsonScalar,
  ],
  plugins: [
    ParentResolvePlugin,
    TimeResolverPlugin,
    QueryCounterPlugin,
  ],
  typegenAutoConfig: {
    sources: [
      {
        source: '@prisma/client',
        alias: 'prisma',
      },
      {
        source: path.join(__dirname, '../types/APIContext.ts'),
        alias: 'APIContext',
      },
    ],
    contextType: 'APIContext.APIContext',
  },

  outputs: {
    schema: path.join(__dirname, '../generated/schema.graphql'),
    typegen: path.join(__dirname, '../generated/nexus.ts'),
  },
});

export default schema;
