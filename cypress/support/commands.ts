import po from './page-objects/auth.po'
//
// function customCommand(param: any): void {
//   console.warn(param);
// }
//
// NOTE: You can use it like so:
// Cypress.Commands.add('customCommand', customCommand);
//
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

export function login() {
  cy.visit('/')
  po.emailInput().type('main@test.com')
  po.getLoginCodeButton().click()
  po.loginCodeInput().type('509950')
  po.loginButton().click().wait(500)
  cy.get('pk-app-bar').should('be.visible')
  cy.get('pk-shortcuts').should('be.visible')
}

Cypress.Commands.add('login', login)

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
