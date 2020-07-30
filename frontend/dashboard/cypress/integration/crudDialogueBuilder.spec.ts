/* eslint-disable radix */
import { first } from 'cypress/types/lodash';

import faker = require('faker');

interface CustomerProps {
  name: string;
  logoUrl: string;
  slug: string;
  primaryColor: string;
}

interface CustomerCreateOptions {
  useTemplate: boolean;
}

const generateCustomer = (): CustomerProps => {
  const companyName = faker.name.findName();

  return {
    name: companyName,
    logoUrl: faker.image.business(),
    primaryColor: '#000000',
    slug: faker.helpers.slugify(companyName),
  };
};

const generateSliderParentQuestion = () => {
  const title = faker.name.findName();
  const minValue = '90';
  const maxValue = '100';
  const option1 = 'Yes';
  const option2 = 'No';
  return {
    title,
    minValue,
    maxValue,
    option1,
    option2,
  };
};

const generateSliderParentQuestionEditData = () => {
  const title = faker.name.findName();
  const minValue = '10';
  const maxValue = '20';
  const option1 = 'Cheese';
  const option2 = 'Ham';
  return {
    title,
    minValue,
    maxValue,
    option1,
    option2,
  };
};

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

describe('Test dialogue builder operations', () => {
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

  // From seed
  // // Check Parent question with child question is available
  it('Check Parent question with child question is available', () => {
    const DialogueBuilder = cy.get('[data-cy="DialogueBuilderContainer"]');
    const rootSection = DialogueBuilder.get('[data-cy="QuestionSection"]').first();

    // Test question expanding
    rootSection.get('[data-cy="QuestionEntry"]').first().contains('Edit').click();
    // TODO: Why doesn't this selects EditButton of rootQuestion but rather all EditButtons
    // const rootQuestion = rootSection.get('[data-cy="QuestionEntry"]').first();
    // rootQuestion.get('[data-cy="EditButton"]').click();
    rootSection.get('[data-cy="QuestionEntry"]').first().contains('General question information');

    // Test other entries are disabled when question is expanded
    const lastChildQuestion = rootSection.get('[data-cy="QuestionEntry"]').last();
    lastChildQuestion.get('[data-cy="EditButton"]').should('be.disabled');
    lastChildQuestion.get('[data-cy="DeleteButton"]').should('be.disabled');
    rootSection.get('[data-cy="QuestionEntry"]').first().contains('Cancel').click();

    // Create question where parent is Slider
    rootSection.get('[data-cy="QuestionEntry"]').first().contains('Slider');
    DialogueBuilder.get('[data-cy="QuestionSection"]').first().contains('Add new question').click();
    const sliderParentQuestion = generateSliderParentQuestion();
    const form = cy.get('form');
    form.within(() => {
      cy.get('input[name="title"]').type(sliderParentQuestion.title);
      cy.get('input[name="minValue"]').type(sliderParentQuestion.minValue);
      cy.get('input[name="maxValue"]').type(sliderParentQuestion.maxValue);
      cy.get('#question-type-select').type('Choice{enter}');
      cy.get('#leaf-node-select').type('Thank you{enter}');
      cy.get('[data-cy="AddOption"]').click();
      cy.get('input[name="options[0]"]').type(sliderParentQuestion.option1);
      cy.get('[data-cy="AddOption"]').click();
      cy.get('input[name="options[1]"]').type(sliderParentQuestion.option2);
      cy.wait(300);
    });
    cy.get('form').submit();
    cy.wait(1000);

    // Test whether created questions contains values previously entered
    const newSection = cy.get('[data-cy="QuestionSection"]').last();
    newSection.last().contains(sliderParentQuestion.title);
    cy.get('[data-cy="QuestionEntry"]').last().find('[data-cy="CTALabel"]').should('have.css', 'background'); // Indicating question has CTA
    cy.get('[data-cy="QuestionEntry"]').last()
      .contains('Edit')
      .click();

    // Test whether values can be edited
    const editQuestionData = generateSliderParentQuestionEditData();
    const newForm = cy.get('form');
    newForm.within(() => {
      cy.get('input[name="title"]').should('have.value', sliderParentQuestion.title);
      cy.get('input[name="minValue"]').should('have.value', sliderParentQuestion.minValue);
      cy.get('input[name="maxValue"]').should('have.value', sliderParentQuestion.maxValue);
      cy.get('input[name="options[0]"]').should('have.value', sliderParentQuestion.option1);
      cy.get('input[name="options[1]"]').should('have.value', sliderParentQuestion.option2);
      cy.get('input[name="title"]').clear().type(editQuestionData.title);
      cy.get('input[name="minValue"]').clear().type(editQuestionData.minValue);
      cy.get('input[name="maxValue"]').clear().type(editQuestionData.maxValue);
      cy.get('#leaf-node-select').type('None{enter}');
      cy.get('input[name="options[0]"]').clear().type(editQuestionData.option1);
      cy.get('input[name="options[1]"]').clear().type(editQuestionData.option2);
      cy.wait(300);
    });

    cy.get('form').submit();
    cy.wait(1000);

    cy.get('[data-cy="QuestionSection"]').last().contains(editQuestionData.title);
    cy.get('[data-cy="QuestionEntry"]').last().find('[data-cy="CTALabel"]')
      .should('not.have.css', 'background-color');
  });
});
