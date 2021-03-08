// This goes: Neutral => Website/Mobile App => Design (+Choice overrideCTA)
beforeEach(() => {
  cy.intercept('POST', 'http://localhost:4000/graphql', (req) => {
    if (req.body.operationName === 'getDialogue') {
      req.reply({ fixture: 'mockGetDialogue.json' });
    }
  }).as('getDialogue');

  cy.intercept('POST', 'http://localhost:4000/graphql', (req) => {
    if (req.body.operationName === 'getCustomer') {
      req.reply({ fixture: 'mockGetCustomer.json' });
    }
  }).as('getCustomer');
})

it('neutral test, set overrideLeaf on Design', () => {
  cy.visit('http://localhost:3000/test/test');

  cy.wait('@getDialogue');
  cy.wait('@getCustomer');

  cy.wait(2000);

  // TODO: Figure out how to do this nicer
  cy
    .findByTestId('slider')
    .invoke('val', 60)
    .trigger('change', { force: true }).click({ force: true });

  // TODO: Find out why so slow
  cy.findByRole('button', { name: /website\/mobile app/i, timeout: 10000 })
    .as('websiteButton');
  cy.get('@websiteButton').should('be.visible');
  cy.get('@websiteButton').click();

  // Design should lead to a Form CTA
  cy.findByRole('button', { name: /design/i }).click();

  // Expect to arrive at a form with this text
  cy.findByText(/we are happy about your positive feedback/i);
  // TODO: Replace with form that is based on their language
  cy.findByText(/leave your details/i);
});

// This goes: Neutral => Website/Mobile App => Other (+Link overrideCTA)
it('neutral test, set overrideLeaf on Other', () => {
  cy.visit('http://localhost:3000/test/test');

  cy.wait('@getDialogue');
  cy.wait('@getCustomer');

  cy.wait(2000);

  // TODO: Figure out how to do this nicer
  cy
    .findByTestId('slider')
    .invoke('val', 60)
    .trigger('change', { force: true }).click({ force: true });

  // TODO: Find out why so slow
  cy.findByRole('button', { name: /website\/mobile app/i, timeout: 10000 })
    .as('websiteButton');
  cy.get('@websiteButton').should('be.visible');
  cy.get('@websiteButton').click();

  // Other should lead to a Link CTA
  cy.findByRole('button', { name: /other/i }).click();

  // Expect to arrive at a form with this text
  cy.findByText(/thank you for your feedback on our website./i);
})

// This goes: Neutral => Website/Mobile App => No overrideleaf
it('neutral test, set no overrideLeaf', () => {
  cy.visit('http://localhost:3000/test/test');

  cy.wait('@getDialogue');
  cy.wait('@getCustomer');

  cy.wait(2000);

  // TODO: Figure out how to do this nicer
  cy
    .findByTestId('slider')
    .invoke('val', 60)
    .trigger('change', { force: true }).click({ force: true });

  // TODO: Find out why so slow
  cy.findByRole('button', { name: /website\/mobile app/i, timeout: 10000 })
    .as('websiteButton');
  cy.get('@websiteButton').should('be.visible');
  cy.get('@websiteButton').click();

  // Informative should lead to a CTA on level 2 (also Form)
  cy.findByRole('button', { name: /informative/i }).click();

  // Expect to arrive at a form with this text
  cy.findByText(/we are happy about your positive feedback./i);

  cy.findByText(/leave your details/i);
})