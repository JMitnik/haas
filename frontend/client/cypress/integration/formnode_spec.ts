/**
 * Settings
**/

interface FormNodeEntry {
  relatedFieldId: string;
  shortText?: string;
  longText?: string;
  email?: string;
  phoneNumber?: string;
  number?: number;
}

// Layer 1 Choice
const firstLayerFacilityButtonText = /facilities/i;

const CTA_Form_Node_text = /Thank you for your feedback/i;

const FORM_VALUES = {
  shortText: 'Short',
  longText: 'Long',
  email: 'info@haas.live',
  number: 123,
  phoneNumber: '+31653289476',
  link: 'http://localhost:3000/test/test',
};

beforeEach(() => {
  cy.graphql('getDialogue', (req) => {
    req.reply({ fixture: 'mockGetOptionalFormNode.json' });
  }, 'getFormNodeDialogue');

  cy.graphql('getCustomer', (req) => {
    req.reply({ fixture: 'mockGetCustomer.json' });
  }, 'getCustomer');

  cy.graphql('createSession', (req) => {
    req.reply({ fixture: 'mockCreateSession.json' });
  }, 'createUserMockSession');

  cy.graphql('appendToInteraction', (req) => {
    req.reply({ fixture: 'mockAppendToInteraction.json' });
  }, 'appendToInteraction');
})

it('Fill in content of form node, check appendToInteraction mutation input', () => {
  cy.visit('http://localhost:3000/test/test');

  cy.wait('@getFormNodeDialogue');
  cy.wait('@getCustomer');

  cy.findByRole('button', { name: firstLayerFacilityButtonText, timeout: 10000 })
    .as('websiteButton');
  cy.get('@websiteButton').should('be.visible');
  cy.get('@websiteButton').click();

  // Expect to arrive at a form with this text
  cy.findByText(CTA_Form_Node_text);

  cy.findByText(/leave your details/i);

  // First request to create session 
  cy.wait('@createUserMockSession');

  // Fill in content
  cy.get('form').findByLabelText('Short text').as('shortTextField').should('exist');
  cy.get('@shortTextField').type(FORM_VALUES.shortText);

  cy.get('form').findByLabelText('Email').as('emailField').should('exist');
  cy.get('@emailField').type(FORM_VALUES.email);

  cy.get('form').findByLabelText('Phone number').as('phoneNumberField').should('exist');
  cy.get('@phoneNumberField').type(FORM_VALUES.phoneNumber);

  cy.get('form').findByLabelText('Long text').as('longTextField').should('exist');
  cy.get('@longTextField').type(FORM_VALUES.longText);

  cy.get('form').findByLabelText('Number').as('numberField').should('exist');
  cy.get('@numberField').type('k123kaas');
  cy.get('@numberField').should('have.value', FORM_VALUES.number);

  // Required field test (check whether submit button is disabled)
  cy.get('form').findByText('Submit').as('submit').should('exist');
  cy.get('form').findByText('Submit').should('be.disabled');

  cy.get('form').findByLabelText('Link*').as('linkField').should('exist');
  cy.get('@linkField').type(FORM_VALUES.link);

  cy.get('@submit').should('not.be.disabled');
  cy.get('@submit').click();

  cy.wait('@appendToInteraction').its('request.body.variables').then((variables) => {
    // Session id should equal to the one generated in createSesion mutation 
    const sessionId = variables.input.sessionId;
    cy.wrap(sessionId).should('equal', 'cknifl3dh2630v0r5vj8x41a2');
    
    // Should contain 6 objects (equal to amount of fields on form node)
    const formNodeEntries: Array<FormNodeEntry> = variables.input.data.form.values;
    cy.wrap(formNodeEntries).should('have.length', 6);

    // Short text field input
    const shortTextObj = formNodeEntries.filter((entry) => entry.relatedFieldId === 'ckmrc2c9f6431z2r5a16l7lzb')[0];
    cy.wrap(shortTextObj).should('have.a.property', 'shortText');
    cy.wrap(shortTextObj).its('shortText').should('equal', FORM_VALUES.shortText);

    // Email field input
    const emailObj = formNodeEntries.filter((entry) => entry.relatedFieldId === 'ckmrc2c9f6432z2r59yt9jooq')[0];
    cy.wrap(emailObj).should('have.a.property', 'email');
    cy.wrap(emailObj).its('email').should('equal', FORM_VALUES.email);

    // Phone number field input
    const phoneObj = formNodeEntries.filter((entry) => entry.relatedFieldId === 'cknif3k7w0717v0r5ikfmr6u8')[0];
    cy.wrap(phoneObj).should('have.a.property', 'phoneNumber');
    cy.wrap(phoneObj).its('phoneNumber').should('equal', FORM_VALUES.phoneNumber);

    // Long text field input
    const longTextObj = formNodeEntries.filter((entry) => entry.relatedFieldId === 'cknif3k7w0719v0r5ak68qph9')[0];
    cy.wrap(longTextObj).should('have.a.property', 'number');
    cy.wrap(longTextObj).its('number').should('equal', FORM_VALUES.number);

    // Long text field input
    const linkObj = formNodeEntries.filter((entry) => entry.relatedFieldId === 'cknif3k7w0720v0r5lv1bhek5')[0];
    cy.wrap(linkObj).should('have.a.property', 'url');
    cy.wrap(linkObj).its('url').should('equal', FORM_VALUES.link);
  });

  cy.findByText('Thank you for participating!').should('exist');
  cy.findByText('How do you feel about Lufthansa?').should('not.exist');
});
