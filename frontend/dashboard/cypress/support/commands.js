import "cypress-localstorage-commands";
import '@testing-library/cypress/add-commands'
// ***********************************************
// This example commands.js shows you how to
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
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

/**
 * Wraps around Graphql
 */
Cypress.Commands.add('graphql', (operationName, callback, alias) => {
  cy.intercept('POST', 'http://localhost:4000/graphql', (req) => {
    console.log('operation name: ', req.body.operationName)
    if (req.body.operationName === operationName) {
      callback(req);
    }
  }).as(alias);
});

Cypress.Commands.add('login', () => {
  cy.visit('http://localhost:3002/verify_token?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNrbTc5ejdmaTAwMDAwMW1oZjhwdzl3a3EiLCJleHAiOjE2MTU4NzI4MzgsImlhdCI6MTYxNTYxMzYzOH0.Zuxda8KPUC7Hw12hcvFgDNtO6AxyZZfiyy0fZ5GhUwc')
  cy.getLocalStorage("access_token").should("exist");
  cy.getLocalStorage("access_token").then(token => {
    console.log("Identity token", token);
  });

});