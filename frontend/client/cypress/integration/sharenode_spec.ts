// Layer 1 Choice
const firstLayerProductServicesButtonText = /Product\/Services/i;

const CTAShareNodeText = /Share with your friends/i;

beforeEach(() => {
  cy.graphql('getDialogue', (req) => {
    req.reply({ fixture: 'mockGetShareCTADialogue.json' });
  }, 'getDialogue');

  cy.graphql('getCustomer', (req) => {
    req.reply({ fixture: 'mockGetCustomer.json' });
  }, 'getCustomer');

  cy.graphql('createSession', (req) => {
    req.reply({ fixture: 'mockCreateSession.json' });
  }, 'createUserMockSession');
});

it('Custom link CTA', () => {
  cy.visit('http://localhost:3000/test/test').then((win) => {
    // Create stub function so share isn't actually called
    win.navigator.share = cy.stub().as('share');

    cy.wait('@getDialogue');
    cy.wait('@getCustomer');

    cy.findByRole('button', { name: firstLayerProductServicesButtonText, timeout: 10000 })
      .as('websiteButton');
    cy.get('@websiteButton').should('be.visible');
    cy.get('@websiteButton').click();

    // First request to create session
    cy.wait('@createUserMockSession').its('request.body.variables.input.entries').then((entries) => {
      const choiceEntry = entries[0];
      const keyValue = choiceEntry?.data.choice;
      cy.wrap(keyValue).its('value').should('equal', 'Product/Services');
    });

    // Expect to arrive at share CTA with this text
    cy.findByText(CTAShareNodeText).should('exist');
    cy.findByText('Delen').click();

    // Test share function is called with following parameters
    const shareParameter = {
      text:
        `Get 90% of your next purchase!
 https://www.linkedin.com/company/haas-happiness-as-a-service/`,
    };
    cy.get('@share').should('be.calledWith', shareParameter);

    cy.reload();
    cy.wait('@getDialogue');
    cy.wait('@getCustomer');
    cy.findByText(CTAShareNodeText).should('exist');
  });
});
