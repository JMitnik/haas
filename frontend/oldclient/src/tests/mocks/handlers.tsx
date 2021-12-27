import { graphql } from 'msw';

import { CustomerStub, CustomerWithDialogueStub } from '../stubs/DialogueStub';

const getCustomerWithDialogue = graphql.query('getDialogue', (req, res, ctx) => res(
  ctx.data({
    ...CustomerWithDialogueStub,
  }),
));

const getCustomer = graphql.query('getCustomer', (req, res, ctx) => res(
  ctx.data({
    customer: {
      ...CustomerStub,
    },
  }),
));

export const handlers = [
  getCustomer,
  getCustomerWithDialogue,
];
