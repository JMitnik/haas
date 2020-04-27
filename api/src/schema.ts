import { makeSchema } from '@nexus/schema';
import { nexusPrismaPlugin } from 'nexus-prisma';
// import { Query } from './queries';
// import { Mutation } from './mutations';
import path from 'path';
import CustomerType, { CustomersQuery } from './models/customer/Customer';
import CustomerSettingsType, { ColourSettingsType, FontSettingsType } from './models/settings/CustomerSettings';
import { DialogueType, DialoguesOfCustomerQuery, DialogueDetailResultType, getQuestionnaireDataQuery, DialogueInput } from './models/questionnaire/Dialogue';
import { UniqueDataResultEntry, NodeEntryValueType, NodeEntryType, SessionType } from './models/session/Session';
import { QuestionNodeType, QuestionOptionType, QuestionNodeWhereInput, getQuestionNodeQuery, QuestionNodeInput } from './models/question/QuestionNode';
import { EdgeConditionType, EdgeType } from './models/edge/Edge';

const schema = makeSchema({
  shouldGenerateArtifacts: true,
  types: [
    QuestionNodeInput,
    getQuestionNodeQuery,
    QuestionNodeWhereInput,
    DialogueInput,
    EdgeConditionType,
    EdgeType,
    QuestionOptionType,
    QuestionNodeType,
    NodeEntryValueType,
    NodeEntryType,
    SessionType,
    DialogueDetailResultType,
    getQuestionnaireDataQuery,
    UniqueDataResultEntry,
    DialoguesOfCustomerQuery,
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
