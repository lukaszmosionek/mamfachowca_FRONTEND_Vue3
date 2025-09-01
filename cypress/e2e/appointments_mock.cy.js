describe('appointments', () => {
  it('appointments', () => {

    //login
    cy.login('provider@onet.pl', 'password') // reusable login in support/commands.ts

    cy.wait(1000)

    cy.visit('/appointments')
    cy.wait(1000)

    cy.intercept('POST', `${Cypress.env('backendUrl')}/appointments/*/accept`).as('accept');
    cy.intercept('POST', `${Cypress.env('backendUrl')}/appointments/*/decline`).as('decline');

    // Klikamy przycisk akceptacji i czekamy na request
    cy.get('button.btn-accept').first().click();
    cy.wait('@accept');

    // Sprawdzamy, czy pojawił się badge "confirmed"
    cy.get('.badge.badge--confirmed', { timeout: 5000 }).should('exist');

    // Klikamy przycisk odrzucenia i czekamy na request
    cy.get('button.btn-decline').first().click();
    cy.wait('@decline');

    // Sprawdzamy, czy pojawił się badge "cancelled"
    cy.get('.badge.badge--cancelled', { timeout: 5000 }).should('exist');

  })
})
