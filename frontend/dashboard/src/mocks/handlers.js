import { graphql } from 'msw';

import createQuestion from './fixtures/topic-builder/mockCreateQuestion';
import createWorkspace from './fixtures/mockCreateWorkspace';
import deleteQuestion from './fixtures/topic-builder/mockDeleteQuestion';
import deleteWorkspace from './fixtures/mockDeleteWorkspace';
import dialogueStatistics from './fixtures/mockDialogueStatistics';
import editWorkspace from './fixtures/mockEditWorkspace';
import getCustomerOfUser from './fixtures/mockWorkspaceOfUserWithAdminRights';
import getCustomers from './fixtures/mockGetCustomers';
import getQuestionnairesOfCustomer from './fixtures/mockGetDialoguesOfWorkspace';
import getTopicBuilder from './fixtures/topic-builder/mockGetTopicBuilder';
import meMock from './fixtures/mockAdminUser';
import refreshAccessToken from './fixtures/mockRefreshActionToken';
import sharedDialogueLayoutProps from './fixtures/mockSharedDialogueLayoutProps';
import updateQuestion from './fixtures/topic-builder/mockUpdateQuestion';

export const handlers = [

  graphql.query('me', (req, res, ctx) => res(ctx.data(meMock.data))),

  graphql.query('refreshAccessToken', (req, res, ctx) => res(ctx.data(refreshAccessToken.data))),

  // Handles a "getCustomers" query
  graphql.query('getCustomers', (req, res, ctx) => res(ctx.data(getCustomers.data))),
  graphql.query('getCustomerOfUser', (req, res, ctx) => res(ctx.data(getCustomerOfUser.data))),

  graphql.query('getQuestionnairesOfCustomer', (req, res, ctx) => res(ctx.data(getQuestionnairesOfCustomer.data))),
  graphql.query('sharedDialogueLayoutProps', (req, res, ctx) => res(ctx.data(sharedDialogueLayoutProps.data))),
  graphql.query('dialogueStatistics', (req, res, ctx) => res(ctx.data(dialogueStatistics.data))),
  graphql.query('getTopicBuilder', (req, res, ctx) => res(ctx.data(getTopicBuilder.data))),

  graphql.mutation('deleteFullCustomer', (req, res, ctx) => res(ctx.data(deleteWorkspace.data))),

  graphql.mutation('createWorkspace', (req, res, ctx) => res(ctx.data(createWorkspace.data))),

  graphql.mutation('editWorkspace', (req, res, ctx) => res(ctx.data(editWorkspace.data))),
  graphql.mutation('updateQuestion', (req, res, ctx) => res(ctx.data(updateQuestion.data))),
  graphql.mutation('deleteQuestion', (req, res, ctx) => res(ctx.data(deleteQuestion.data))),
  graphql.mutation('createQuestion', (req, res, ctx) => res(ctx.data(createQuestion.data))),
];
