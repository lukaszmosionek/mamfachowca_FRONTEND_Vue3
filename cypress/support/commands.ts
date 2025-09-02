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
// declare global {
  //   namespace Cypress {
    //     interface Chainable {
      //       login(email: string, password: string): Chainable<void>
      //       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
      //       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
      //       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
      //     }
      //   }
      // }



Cypress.Commands.add('login', (email = 'testuser@test.pl', password = 'password123') => {
    cy.visit('/login') // visit login page
    cy.get('input[name="email"]').type(email)
    cy.get('input[name="password"]').type(password)
    cy.get('button[type="submit"]').click()
})


Cypress.Commands.add('changeLanguage', (changeTo='pl') => {
    // cy.visit('/') // visit login page

    cy.get('body').then(($body) => {
      // Check if Polish button exists
      if ($body.find('button#changeLanguage-'+changeTo).length === 1) {
        // If not, click English button
        cy.get('button#changeLanguage-'+changeTo).click();
      }
    });

})

