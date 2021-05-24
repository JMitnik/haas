import { makeSchema } from '@nexus/schema';
import path from 'path';

import nexus from './nexus';


console.log(process.env.NODE_ENV);
const schema = makeSchema({
  shouldGenerateArtifacts: process.env.NODE_ENV === "development",
  types: [
    ...nexus,
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
