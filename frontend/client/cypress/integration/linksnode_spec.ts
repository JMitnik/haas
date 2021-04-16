// Layer 1 Choice
const firstLayerCustomerSupportButtonText = /Customer Support/i;

const CTA_Link_Node_text = /Follow us on Instagram and stay updated/i;

beforeEach(() => {
  cy.graphql('getDialogue', (req) => {
    req.reply({ fixture: 'mockGetLinkCTADialogue.json' });
  }, 'getLinksNodeDialogue');

  cy.graphql('getCustomer', (req) => {
    req.reply({ fixture: 'mockGetCustomer.json' });
  }, 'getCustomer');

  cy.graphql('createSession', (req) => {
    req.reply({ fixture: 'mockCreateSession.json' });
  }, 'createUserMockSession');
})

it('Custom link CTA', () => {
  cy.visit('http://localhost:3000/test/test');

  cy.wait('@getLinksNodeDialogue');
  cy.wait('@getCustomer');

  cy.findByRole('button', { name: firstLayerCustomerSupportButtonText, timeout: 10000 })
    .as('websiteButton');
  cy.get('@websiteButton').should('be.visible');
  cy.get('@websiteButton').click();

  // First request to create session 
  cy.wait('@createUserMockSession').its('request.body.variables.input.entries').then((entries) => {
    const choiceEntry = entries[0];
    const keyValue = choiceEntry?.data.choice;
    cy.wrap(keyValue).its('value').should('equal', 'Customer Support');
  });

  // Expect to arrive at link CTA with this text
  cy.findByText(CTA_Link_Node_text).should('exist');

  // Test if amount of links correspondents with mock data
  cy.findByTestId('shareitems').children().should('have.length', 6);

  // Test whether standard icon is set if none selected 
  cy.findByTestId('SOCIAL').findByTestId('globe').should('exist');

  // Test whether custom icon is set if selected
  cy.findByTestId('API').get('img').should('have.attr', 'src', 'https://res.cloudinary.com/haas-storage/image/upload/v1618548214/activity_abc16g.svg');

  // Test whether standard background color is set if none is selected
  cy.findByTestId('API').should('have.css', 'backgroundColor', 'rgb(0, 123, 181)');

  // Test if custom inputs are set
  cy.findByTestId('INSTAGRAM').should($a => {
    expect($a.attr('href'), 'href').to.equal('https://instagram.com');
    expect($a.attr('target'), 'target').to.equal('__blank');
    expect($a.attr('title'), 'title').to.equal('Go to instagram');
    expect($a.css('backgroundColor'), 'backgroundColor').to.equal('rgb(195, 42, 163)');
  });

  // Verify stay on same page when it is reloaded
  cy.reload();
  cy.findByText(CTA_Link_Node_text).should('exist');
  cy.findByText('How do you feel about Lufthansa?').should('not.exist');
});
