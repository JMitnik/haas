import { graphql, rest } from 'msw';
import CustomerWithDialogueStub from '../stubs/DialogueStub';

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
        name: 'test',
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
