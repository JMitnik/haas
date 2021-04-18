import "cypress-localstorage-commands";

const CREATE_WORKSPACE_INPUT = {

}

const UPDATE_WORKSPACE_INPUT = {
  
}

describe("Login logic", () => {

    beforeEach(() => {
      cy.graphql('getCustomers', (req) => {
        req.reply({ fixture: 'mockGetCustomers.json' });
      }, 'getCustomers');

      cy.graphql('getQuestionnairesOfCustomer', (req) => {
        req.reply({ fixture: 'mockGetDialoguesOfWorkspace.json'});
      }, 'getDialoguesOfWorkspace')
    });

  before(() => {
    cy.setLocalStorage("access_token", 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNrbTc5ejdmaTAwMDAwMW1oZjhwdzl3a3EiLCJleHAiOjE2MTU4NzI4MzgsImlhdCI6MTYxNTYxMzYzOH0.Zuxda8KPUC7Hw12hcvFgDNtO6AxyZZfiyy0fZ5GhUwc');
    cy.saveLocalStorage();
  });

  it("Login and fetch customers", () => {
    cy.login();
    cy.wait('@getCustomers');

    // Test READ workspace
    cy.findByText('Lufthansa').should('exist');

    // Test logo is displayed on workspace card
    cy.get('img').should('have.attr', 'src', 'https://www.vakantie-krant.nl/wp-content/uploads/2014/03/lufthansa-logo.jpg');
    
    cy.findByTestId('CustomerCard').as('card').should('have.css', 'background-color', 'rgb(190, 227, 248)');

    // TEST UPDATE workspace
    cy.get('@card').click();
    cy.wait('@getDialoguesOfWorkspace');
    cy.findByText('Settings').as('settings').should('exist').click();

  });
});