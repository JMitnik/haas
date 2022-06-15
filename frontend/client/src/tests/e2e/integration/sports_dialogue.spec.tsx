import { mockQueryGetCustomer, mockQueryGetSportsDialogue } from 'tests/__mocks__/GetSportsDialogue.mock';

it('dialogue is finished on a positive flow', () => {
  mockQueryGetSportsDialogue((res) => ({ ...res }));
  mockQueryGetCustomer((res) => ({ ...res }));

  cy.visit('http://localhost:3000/club-hades/Female-U18-Team2');
});
