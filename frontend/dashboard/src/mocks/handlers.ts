// eslint-disable-next-line import/no-extraneous-dependencies
import { graphql } from 'msw';
import createWorkspace from './fixtures/mockCreateWorkspace';
import deleteWorkspace from './fixtures/mockDeleteWorkspace';
import editWorkspace from './fixtures/mockEditWorkspace';
import getCustomerOfUser from './fixtures/mockWorkspaceOfUserWithAdminRights';
import getCustomers from './fixtures/mockGetCustomers';
import getQuestionnairesOfCustomer from './fixtures/mockGetDialoguesOfWorkspace';
import meMock from './fixtures/mockAdminUser';
import refreshAccessToken from './fixtures/mockRefreshActionToken';

export const handlers = [
  graphql.query('me', (req, res, ctx) => res(ctx.data(meMock.data))),
  graphql.query('refreshAccessToken', (req, res, ctx) => res(ctx.data(refreshAccessToken.data))),
  graphql.query('getCustomers', (req, res, ctx) => res(ctx.data(getCustomers.data))),
  graphql.query('getCustomerOfUser', (req, res, ctx) => res(ctx.data(getCustomerOfUser.data))),
  graphql.query('getQuestionnairesOfCustomer', (req, res, ctx) => res(ctx.data(getQuestionnairesOfCustomer.data))),
  graphql.mutation('deleteFullCustomer', (req, res, ctx) => res(ctx.data(deleteWorkspace.data))),
  graphql.mutation('createWorkspace', (req, res, ctx) => res(ctx.data(createWorkspace.data))),
  graphql.mutation('editWorkspace', (req, res, ctx) => res(ctx.data(editWorkspace.data))),
];
