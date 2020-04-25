import { makeSchema } from '@nexus/schema';
import { nexusPrismaPlugin } from 'nexus-prisma';
// import { Query } from './queries';
// import { Mutation } from './mutations';
import path from 'path';
import CustomerType, { CustomersQuery, DialogueType } from './models/customer/Customer';
import CustomerSettingsType, { ColourSettingsType, FontSettingsType } from './models/settings/CustomerSettings';

const schema = makeSchema({
  shouldGenerateArtifacts: true,
  types: [
    ColourSettingsType,
    FontSettingsType,
    DialogueType,
    CustomersQuery,
    CustomerType,
    CustomerSettingsType,
  ],
  plugins: [
    nexusPrismaPlugin(),
  ],
  // Tells nexus where to look for types when generating the graphql schema
  typegenAutoConfig: {
    sources: [
      {
        source: '../node_modules/@prisma/client',
        alias: 'prisma',
      },
    ],
  },
  // Tells nexus where to output the generated graphql schema and types
  outputs: {
    schema: path.join(__dirname, './generated/schema.graphql'),
    // typegen: path.join(__dirname, './generated/nexus.ts'),
  },
});

export default schema;
