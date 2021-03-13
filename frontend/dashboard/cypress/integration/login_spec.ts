import "cypress-localstorage-commands";



describe("Login logic", () => {

  beforeEach(() => {
    cy.intercept('POST', 'http://localhost:4000/graphql', (req) => {
      if (req.body.operationName === 'verifyUserToken') {
        req.reply({ fixture: 'verifyUserToken.json' });
      }
    }).as('verifyUserToken');

    cy.intercept('POST', 'http://localhost:4000/graphql', (req) => {
      if (req.body.operationName === 'me') {
        req.reply({ fixture: 'mockMe.json' });
      }
    }).as('me');

    cy.intercept('POST', 'http://localhost:4000/graphql', (req) => {
      if (req.body.operationName === 'refreshAccessToken') {
        req.reply({ fixture: 'mockRefreshActionToken.json' });
      }
    }).as('refreshAccessToken');

    cy.intercept('POST', 'http://localhost:4000/graphql', (req) => {
      if (req.body.operationName === 'getCustomers') {
        req.reply({ fixture: 'mockGetCustomers.json' });
      }
    }).as('getCustomers');

    cy.restoreLocalStorage();
  })

  before(() => {
    cy.setLocalStorage("access_token", 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNrbTc5ejdmaTAwMDAwMW1oZjhwdzl3a3EiLCJleHAiOjE2MTU4NzI4MzgsImlhdCI6MTYxNTYxMzYzOH0.Zuxda8KPUC7Hw12hcvFgDNtO6AxyZZfiyy0fZ5GhUwc');
    cy.saveLocalStorage();
  });

  it("should exist identity in localStorage", () => {
    cy.visit('http://localhost:3002/verify_token?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNrbTc5ejdmaTAwMDAwMW1oZjhwdzl3a3EiLCJleHAiOjE2MTU4NzI4MzgsImlhdCI6MTYxNTYxMzYzOH0.Zuxda8KPUC7Hw12hcvFgDNtO6AxyZZfiyy0fZ5GhUwc')
    cy.wait('@verifyUserToken');
    cy.getLocalStorage("access_token").should("exist");
    cy.getLocalStorage("access_token").then(token => {
      console.log("Identity token", token);
    });

    cy.wait('@me')
    cy.wait('@refreshAccessToken')
    cy.wait('@getCustomers')
  });

})






