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
  useTemplate?: boolean;
  willSubmit?: boolean
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

const createDialogueFromDialoguesPage = (dialogue: DialogueProps, options?: DialogueCreateOptions) => {
  // Go to add dialogue view
  cy.get('[data-cy="AddDialogueCard"]').click();

  // Fill in form
  const form = cy.get('form');
  form.within(() => {
    cy.get('input[name="title"]').type(dialogue.title);
    cy.get('input[name="publicTitle"]').type(dialogue.publicTitle);
    cy.get('input[name="slug"]').type(dialogue.urlSlug);
    cy.get('textarea[name="description"]').type(dialogue.description);
  });

  if (options?.willSubmit) {
    cy.get('form').submit();
  }
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

const generateDialogue = (): DialogueProps => ({
  description: 'Default',
  publicTitle: 'Title',
  title: 'Default test with tags',
  urlSlug: 'Test',
});

describe('Test Dialogue operations', () => {
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
    cy.contains('Builder');
  });

  it('Creates a second dialogue using the Create Dialogue screen', () => {
    // Just in case, assume we are in dashboard already, and click
    cy.get('[data-cy="Sidenav"]').contains('Dialogues').click();

    const newDialogue: DialogueProps = {
      title: 'Test Dialogue',
      description: 'Test dialogue to be deleted',
      publicTitle: 'Dialogue to go!',
      urlSlug: 'test-dialogue',
    };

    createDialogueFromDialoguesPage(newDialogue);
    cy.get('form').submit();
  });

  it('Search for the newly made test dialogue', () => {
    // Just in case, assume we are in dashboard already, and click
    cy.get('[data-cy="Sidenav"]').contains('Dialogues').click();

    // Type test in the search bar
    cy.get('[data-cy="SearchbarInput"]').type('Test');

    // Wait 3 sec
    cy.wait(1000);
    cy.get('[data-cy="DialogueCard"]').should('have.length', 1);
  });

  it('Deletes the second dialogue', () => {
    // We should be back at the dialogues overview
    const dialogueCard = cy.contains('Test Dialogue').parentsUntil('[data-cy="DialogueCard"]');
    dialogueCard.find('[data-cy="ShowMoreButton"]').click();

    // There should be a dropdown (maybe test?)
    dialogueCard.contains('Delete').click();
  });

  it('Creates a dialogue with a tag', () => {
    cy.visit('http://localhost:3002/b');

    // Go to dashboard and create customer
    const newCustomer = generateCustomer();
    createCustomerFromDashboardPage(newCustomer);

    // Create a new dialogue, and fill it in with basic stuff
    cy.contains(company.name).parentsUntil('[data-cy="CustomerCard"]').first().click();
    const newDialogue = generateDialogue();
    createDialogueFromDialoguesPage(newDialogue, {
      willSubmit: false,
    });

    cy.get('[data-cy="AddTagButton"]').click();

    // Dealing with react dropdowns
    cy.get('[data-cy="SelectOptions"]')
      .find('[class*="-control"]')
      .click(0, 0, { force: true });

    cy.get('[data-cy="SelectOptions"]')
      .find('[class*="-menu"]')
      .find('[class*="-option"]')
      .eq(1)
      .click(0, 0, { force: true });

    // Submit
    cy.get('form').submit();

    // Go to dialogueoverview, expect to see a tag on the card
    cy.contains(newDialogue.title).parentsUntil('[data-cy="DialogueCard"]').find('[data-cy="TagLabel"]')
      .should('have.length', 1);
  });
});
