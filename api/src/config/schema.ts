import { makeSchema, asNexusMethod, declarativeWrappingPlugin } from 'nexus';
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
    declarativeWrappingPlugin(),
    ParentResolvePlugin,
    TimeResolverPlugin,
    QueryCounterPlugin,
  ],

  sourceTypes: {
    modules: [
      {
        module: '@prisma/client',
        alias: 'prisma',
      },
      {
        module: path.join(__dirname, '../types/APIContext.ts'),
        alias: 'APIContext',
      },
    ],


  },
  contextType: {
    // ''
    export: 'APIContext',
    module: path.join(__dirname, '../types/APIContext.ts'),
    // alias: 'APIContext',
  },
  outputs: {
    schema: path.join(__dirname, '../generated/schema.graphql'),
    typegen: path.join(__dirname, '../generated/nexus.ts'),
  },
});

export default schema;
