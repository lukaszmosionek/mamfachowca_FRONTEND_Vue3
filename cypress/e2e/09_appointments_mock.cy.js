describe('appointments', () => {
  it('appointments', () => {

    //login
    cy.login('provider@onet.pl', 'password') // reusable login in support/commands.ts

    cy.get('a[href="/account"]').realHover()
    cy.get('a[href="/appointments"]').should('be.visible').click()
    cy.get('body').realHover();
    // cy.wait(1000)

    // cy.intercept('POST', `${Cypress.env('backendUrl')}/appointments/*/accept`).as('accept');
    // cy.intercept('POST', `${Cypress.env('backendUrl')}/appointments/*/decline`).as('decline');

    // Klikamy przycisk akceptacji i czekamy na request
    cy.get('.badge').then(($badge) => {
      if ($badge.hasClass('badge--confirmed')) {
        // Jest confirmed → klikamy decline
        cy.get('button.btn-decline').first().click();
        // cy.wait('@decline');
        cy.get('.badge.badge--cancelled', { timeout: 5000 }).should('exist');
      } else {
        // Nie jest confirmed → klikamy accept
        cy.get('button.btn-accept').first().click();
        // cy.wait('@accept');
        cy.get('.badge.badge--confirmed', { timeout: 5000 }).should('exist');
      }
    });

  })
})
