import "cypress-localstorage-commands";
import getCustomers from '../../src/mocks/fixtures/mockGetCustomers'

describe("Login logic", () => {

  before(() => {
    cy.setLocalStorage("access_token", 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNrbTc5ejdmaTAwMDAwMW1oZjhwdzl3a3EiLCJleHAiOjE2MTU4NzI4MzgsImlhdCI6MTYxNTYxMzYzOH0.Zuxda8KPUC7Hw12hcvFgDNtO6AxyZZfiyy0fZ5GhUwc');
    cy.saveLocalStorage();
  });

  it("Login and fetch customers", () => {
    cy.login();
    cy.findByText(getCustomers.data.user.customers[0].name).should('exist')
  });
});