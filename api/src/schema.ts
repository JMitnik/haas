import { makeSchema } from '@nexus/schema';
import path from 'path';
import nexus from './nexus/index';

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
    ],
  },
  outputs: {
    schema: path.join(__dirname, './generated/schema.graphql'),
    typegen: path.join(__dirname, './generated/nexus.ts'),
  },
});

export default schema;
