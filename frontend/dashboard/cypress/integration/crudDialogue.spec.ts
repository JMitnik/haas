import faker = require('faker');

interface CustomerProps {
  name: string;
  logoUrl: string;
  slug: string;
  primaryColor: string;
}

interface CustomerCreateOptions {
  useTemplate: boolean
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
    primaryColor: '#ffffff',
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
});
