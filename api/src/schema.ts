import { makeSchema } from '@nexus/schema';
import { nexusPrismaPlugin } from 'nexus-prisma';
// import { Query } from './queries';
// import { Mutation } from './mutations';
import path from 'path';
import CustomerType, { CustomersQuery, DeleteCustomerMutation } from './models/customer/Customer';
import CustomerSettingsType, { ColourSettingsType, FontSettingsType } from './models/settings/CustomerSettings';
import { DialogueWhereUniqueInput, deleteDialogueOfCustomerMutation, DialogueType, DialoguesOfCustomerQuery, DialogueDetailResultType, getQuestionnaireDataQuery } from './models/questionnaire/Dialogue';
import { SessionWhereUniqueInput, getSessionAnswerFlowQuery, UniqueDataResultEntry, NodeEntryValueType, NodeEntryType, SessionType, uploadUserSessionMutation, UploadUserSessionInput, UserSessionEntryInput, UserSessionEntryDataInput } from './models/session/Session';
import { QuestionNodeType, QuestionOptionType, QuestionNodeWhereInput, getQuestionNodeQuery, QuestionNodeInput } from './models/question/QuestionNode';
import { EdgeConditionType, EdgeType } from './models/edge/Edge';

const schema = makeSchema({
  shouldGenerateArtifacts: true,
  types: [
    deleteDialogueOfCustomerMutation,
    DialogueWhereUniqueInput,
    DeleteCustomerMutation,
    SessionWhereUniqueInput,
    getSessionAnswerFlowQuery,
    UploadUserSessionInput,
    UserSessionEntryInput,
    UserSessionEntryDataInput,
    uploadUserSessionMutation,
    QuestionNodeInput,
    getQuestionNodeQuery,
    QuestionNodeWhereInput,
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
