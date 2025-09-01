describe('Book Appointment', () => {
  it('Book Appointment', () => {

    cy.login('client@onet.pl', 'password') // reusable login in support/commands.ts

    //click first book button
    cy.get('button.book-service').first().click()

    //book appointment
    cy.intercept('GET', `${Cypress.env('backendUrl')}/services/*`).as('serviceRequest');
    cy.wait('@serviceRequest')

    cy.get('.select-date input').click()

    cy.get('button[data-dp-element="action-next"]').first().click();
    cy.get('.select-date div.dp__calendar_item:not([aria-disabled="true"])').first().click();

    cy.get('.select-hour select').find('option').first().then(option => { cy.get('.select-hour select').select(option.val()); });

    cy.wait(500)

    cy.get('.select-minute select').find('option').first().then(option => { cy.get('.select-minute select').select(option.val()); });

    cy.get('button.button-book').click()

    cy.wait(3000)

    cy.get('.swal2-popup', { timeout: 10000 }).should('be.visible');
    cy.get('.swal2-popup').find('.swal2-success-ring').should('exist');
    cy.contains('OK').click();
  })
})
