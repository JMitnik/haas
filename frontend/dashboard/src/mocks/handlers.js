import { graphql } from 'msw'
import meMock from './fixtures/mockAdminUser'
import getCustomers from './fixtures/mockGetCustomers'
import refreshAccessToken from './fixtures/mockRefreshActionToken'
import deleteWorkspace from './fixtures/mockDeleteWorkspace'
import getCustomerOfUser from './fixtures/mockWorkspaceOfUserWithAdminRights'
import getQuestionnairesOfCustomer from './fixtures/mockGetDialoguesOfWorkspace'
import editWorkspace from './fixtures/mockEditWorkspace'
import createWorkspace from './fixtures/mockCreateWorkspace'
import GetWorkspaceUsersConnects from './fixtures/mockGetWorkspaceUsersConnects'
export const handlers = [
  
  graphql.query('me', (req, res, ctx) => {
    return res(ctx.data(meMock.data))
  }),

  graphql.query('refreshAccessToken', (req, res, ctx) => {
    return res(ctx.data(refreshAccessToken.data))
  }),

  // Handles a "getCustomers" query
  graphql.query('getCustomers', (req, res, ctx) => {
    return res(ctx.data(getCustomers.data))
  }),

  graphql.query('getCustomerOfUser', (req, res, ctx) => {
    return res(ctx.data(getCustomerOfUser.data))
  }),

  graphql.query('getQuestionnairesOfCustomer', (req, res, ctx) => {
    return res(ctx.data(getQuestionnairesOfCustomer.data))
  }),

  graphql.query('GetWorkspaceUsersConnects',(req, res, ctx)=>{
    return res(ctx.data(GetWorkspaceUsersConnects.data))
  }),

  graphql.mutation('deleteFullCustomer', (req, res, ctx) => {
    return res(ctx.data(deleteWorkspace.data))
  }),

  graphql.mutation('createWorkspace', (req, res, ctx) => {
    return res(ctx.data(createWorkspace.data))
  }),

  graphql.mutation('editWorkspace', (req, res, ctx) => {
    return res(ctx.data(editWorkspace.data))
  })
];