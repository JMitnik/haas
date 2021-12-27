import { graphql } from 'msw'
import mockGetCustomer from './mockGetCustomer';
import mockGetDialogue from './mockGetDialogue'

export const handlers = [
  // graphql.query('getDialogue', (req, res, ctx) => {
  //   return res(ctx.data({ ...mockGetDialogue }));
  // }),
  // graphql.query('getCustomer', (req, res, ctx) => {
  //   return res(ctx.data({ ...mockGetCustomer }));
  // })
]