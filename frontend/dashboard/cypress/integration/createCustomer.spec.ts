import faker = require('faker');

interface CustomerProps {
  name: string;
  logoUrl: string;
  slug: string;
  primaryColor: string;
}

const createCustomerFromDashboardPage = (customer: CustomerProps) => {
  cy.get('a[href*="add"]').click();

  // Register form and submit
  const form = cy.get('form');
  form.within(() => {
    cy.get('input[name="name"]').type(customer.name);
    cy.get('input[name="logo"]').type(customer.logoUrl);
    cy.get('input[name="slug"]').type(customer.slug);
    cy.get('input[name="primaryColour"]').type(customer.primaryColor);
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

describe('Creating a customer, deleting a customer, editing a customer', () => {
  const company = generateCustomer();

  it('Visits the dashboard page', () => {
    cy.visit('localhost:3002');

    // Expect that we are in the customersoverview
    cy.contains('Customer');
  });

  it('Creates a customer', () => {
    createCustomerFromDashboardPage(company);
  });

  it('Edits this customer', () => {
    // Assert we are still in this page
    cy.contains('Customers');

    // Go to customer card and edit.
    const customerCard = cy.contains(company.name).parentsUntil('[data-cy="CustomerCard"]');
    customerCard.find('[data-cy="EditCustomerButton"]').click();

    const form = cy.get('form');
    form.within(() => {
      cy.get('input[name="logo"]').type(faker.image.imageUrl());
    });
    cy.get('form').submit();
  });

  it('Delete this customer', () => {
    // Assert we are still in this page
    cy.contains('Customers');

    // Find the customer-card
    const customerCard = cy.contains(company.name).parentsUntil('[data-cy="CustomerCard"]');
    customerCard.find('[data-cy="DeleteCustomerButton"]').click();
    customerCard.should('not.exist');
  });
});
