/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//

// @ts-ignore
const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;

const setInput = (inputs: any, score: number) => {
  const mainInput = inputs[0];

  nativeInputValueSetter?.call(mainInput, score);
  // @ts-ignore
  mainInput.dispatchEvent(new Event('change', { value: score, bubbles: true }));
};

/**
 * Adds the ability to slide the slider to a given value.
 *
 * @param score - Score to eventually slide to.
 * @param wait - Time to wait in seconds.
 */
Cypress.Commands.add('slide', (score, wait) => {
  let bound = 0;

  if (score > 50) {
    bound = 100;
  }
  cy.wait(wait * 1000);

  cy.findByTestId('slider')
    .focus()
    .trigger('change');

  cy.findByTestId('slider').then((inputs) => setInput(inputs, bound));

  cy.wait((wait / 2) * 1000);

  cy.findByTestId('slider').then((inputs) => setInput(inputs, score));

  cy.findByTestId('slider')
    .trigger('mouseup');
});

declare global {
  namespace Cypress {
    interface Chainable {
      slide(score: number, wait: number): Chainable<Element>;
      login(email: string, password: string): Chainable<void>
      drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
      dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
    }
  }
}

export {};
