import { CustomerStub, CustomerWithDialogueStub } from '../stubs/DialogueStub';
import { graphql, rest } from 'msw';

const getCustomerWithDialogue = graphql.query('getDialogue', (req, res, ctx) => {
  console.log('Ahhh!');

  return res(
    ctx.data({
      ...CustomerWithDialogueStub,
    }),
  );
});

const getCustomer = graphql.query('getCustomer', (req, res, ctx) => {
  console.log('Ahhh!');

  return res(
    ctx.data({
      customer: {
        ...CustomerStub,
      },
    }),
  );
});

// const test = rest.get('*', (req, res, ctx) => res(
//   ctx.json({
//     data: 'test',
//   }),
// ));

export const handlers = [
  getCustomer,
  getCustomerWithDialogue,
];
