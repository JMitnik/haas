import faker = require('faker');

interface CustomerProps {
  name: string;
  logoUrl: string;
  slug: string;
  primaryColor: string;
}

interface DialogueProps {
  title: string;
  publicTitle: string;
  urlSlug: string;
  description: string;
}

interface DialogueCreateOptions {
  useTemplate: boolean;
}

interface CustomerCreateOptions {
  useTemplate: boolean;
}

const createCustomerFromDashboardPage = (customer: CustomerProps, customerCreateOptions?: CustomerCreateOptions) => {
  cy.get('a[href*="add"]').click();

  // Register form and submit
  const form = cy.get('form');
  form.within(() => {
    cy.get('input[name="name"]').type(customer.name);
    cy.get('input[name="logo"]').type(customer.logoUrl);
    cy.get('input[name="slug"]').type(customer.slug);
    cy.get('input[name="primaryColour"]').type(customer.primaryColor);

    if (customerCreateOptions?.useTemplate) {
      cy.get('input[name="seed"]').check();
    }
  });

  cy.get('form').submit();
};

const generateCustomer = (): CustomerProps => {
  const companyName = faker.name.findName();

  return {
    name: companyName,
    logoUrl: faker.image.business(),
    primaryColor: '#000000',
    slug: faker.helpers.slugify(companyName),
  };
};

describe('Creating a customer, with a default dialogue', () => {
  const company = generateCustomer();

  it('Visits the dashboard page', () => {
    cy.visit('localhost:3002');

    // Expect that we are in the customersoverview
    cy.contains('Customer');
  });

  it('Creates a customer with a default template', () => {
    createCustomerFromDashboardPage(company, {
      useTemplate: true,
    });

    // Navigate to the dialogues page and check that there is one dialogue
    cy.contains(company.name).parentsUntil('[data-cy="CustomerCard"]').first().click();
    cy.contains('Dialogues');
    const dialogueCards = cy.get('[data-cy="DialogueCard"]');
    dialogueCards.should('have.length', 1);

    // Go to dialogue builder view
    dialogueCards.first().click();
    const tabBar = cy.get('[data-cy="DialogueTabbar"]');
    tabBar.contains('Builder').click();
    cy.contains('Dialogue builder');
  });

  it('Creates a second dialogue using the Create Dialogue screen', () => {
    const newDialogue: DialogueProps = {
      title: 'Test Dialogue',
      description: 'Test dialogue to be deleted',
      publicTitle: 'Dialogue to go!',
      urlSlug: 'test-dialogue',
    };

    // Just in case, assume we are in dashboard already, and click
    const sidenav = cy.get('[data-cy="Sidenav"]');
    sidenav.contains('Dialogues').click();

    // Go to add dialogue view
    cy.get('[data-cy="AddDialogueCard"]').click();

    // Fill in form
    const form = cy.get('form');
    form.within(() => {
      cy.get('input[name="title"]').type(newDialogue.title);
      cy.get('input[name="publicTitle"]').type(newDialogue.publicTitle);
      cy.get('input[name="slug"]').type(newDialogue.urlSlug);
      cy.get('textarea[name="description"]').type(newDialogue.description);
    });

    // Submit (save form)
    cy.get('form').submit();
  });

  it('Search for the newly made test dialogue', () => {
    // Just in case, assume we are in dashboard already, and click
    const sidenav = cy.get('[data-cy="Sidenav"]');
    sidenav.contains('Dialogues').click();

    // Type test in the search bar
    cy.get('[data-cy="SearchbarInput"]').type('Test');

    // Wait 3 sec
    cy.wait(3000);
    cy.get('[data-cy="DialogueCard"]').should('have.length', 1);
  });

  it('Deletes the second dialogue', () => {
    // We should be back at the dialogues overview
    const dialogueCard = cy.contains('Test Dialogue').parentsUntil('[data-cy="DialogueCard"]');
    dialogueCard.find('[data-cy="ShowMoreButton"]').click();

    // There should be a dropdown (maybe test?)
    dialogueCard.contains('Delete').click();
  });
});
