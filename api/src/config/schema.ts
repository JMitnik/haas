import { makeSchema } from '@nexus/schema';
import path from 'path';

// eslint-disable-next-line import/no-cycle
import nexus from './nexus';

const schema = makeSchema({
  shouldGenerateArtifacts: true,
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
        source: path.join(__dirname, './types/APIContext.ts'),
        alias: 'APIContext',
      },
    ],
    contextType: 'APIContext.APIContext',
  },

  outputs: {
    schema: path.join(__dirname, './generated/schema.graphql'),
    typegen: path.join(__dirname, './generated/nexus.ts'),
  },
});

export default schema;
