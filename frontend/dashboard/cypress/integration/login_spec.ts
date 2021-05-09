import "cypress-localstorage-commands";
import getCustomers from '../../src/mocks/fixtures/mockGetCustomers'

describe("Login logic", () => {

  beforeEach(() => {
    cy.intercept('POST', 'http://localhost:4000/graphql', (req) => {
      console.log('iets geintercepts?')
      if (req.body.operationName === 'getCustomers') {
        console.log('hey hoy gevonden')
        req.alias = 'getCustomers';
        req.continue();
      } 
    })
  });

  before(() => {
    cy.setLocalStorage("access_token", 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNrbTc5ejdmaTAwMDAwMW1oZjhwdzl3a3EiLCJleHAiOjE2MTU4NzI4MzgsImlhdCI6MTYxNTYxMzYzOH0.Zuxda8KPUC7Hw12hcvFgDNtO6AxyZZfiyy0fZ5GhUwc');
    cy.saveLocalStorage();
  });

  it("Login and fetch customers", () => {
    cy.login();
    cy.findByText(getCustomers.data.user.customers[0].name).should('exist')
  });
});