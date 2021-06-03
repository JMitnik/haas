/**
 * Settings
* */

// Neutral path with Node-CTA: Form (we are happy about your positive feedback)
const sliderScore = 60;

// Layer 1 Choice
const firstLayerButtonText = /website\/mobile app/i;

// Layer 2 Choice with Choice-CTA:Form (we are happy about your positive feedback)
const secondLayerChoiceA = /design/i;
const CTAAText = /we are happy about your positive feedback/i;

// Layer 2 Choice with Choice-CTA:Link (thank you for your feedback)
const secondLayerChoiceB = /other/i;
const CTABText = /thank you for your feedback on our website./i;

// Layer 2 Choice with no-CTA (so previous Node-CTA)
const secondLayerChoiceNoCTA = /informative/i;
const CTA0Text = /we are happy about your positive feedback./i;

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
});

it('neutral test, set overrideLeaf on Design', () => {
  cy.visit('http://localhost:3000/test/test');

  cy.wait('@getDialogue');
  cy.wait('@getCustomer');

  cy.wait(2000);

  // TODO: Figure out how to do this nicer
  cy
    .findByTestId('slider')
    .invoke('val', sliderScore)
    .trigger('change', { force: true }).click({ force: true });

  // TODO: Find out why so slow
  cy.findByRole('button', { name: firstLayerButtonText, timeout: 10000 })
    .as('websiteButton');
  cy.get('@websiteButton').should('be.visible');
  cy.get('@websiteButton').click();

  // Design should lead to a Form CTA
  cy.findByRole('button', { name: secondLayerChoiceA }).click();

  // Expect to arrive at a form with this text
  cy.findByText(CTAAText);
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
  cy.findByRole('button', { name: firstLayerButtonText, timeout: 10000 })
    .as('websiteButton');
  cy.get('@websiteButton').should('be.visible');
  cy.get('@websiteButton').click();

  // Other should lead to a Link CTA
  cy.findByRole('button', { name: secondLayerChoiceB }).click();

  // Expect to arrive at a form with this text
  cy.findByText(CTABText);
});

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
  cy.findByRole('button', { name: firstLayerButtonText, timeout: 10000 })
    .as('websiteButton');
  cy.get('@websiteButton').should('be.visible');
  cy.get('@websiteButton').click();

  // Informative should lead to a CTA on level 2 (also Form)
  cy.findByRole('button', { name: secondLayerChoiceNoCTA }).click();

  // Expect to arrive at a form with this text
  cy.findByText(CTA0Text);

  cy.findByText(/leave your details/i);
});
