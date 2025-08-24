describe('Book Appointment', () => {
  it('Book Appointment', () => {

    //login
    cy.visit('/login')
    cy.get('input[name="email"]').type('client@onet.pl')
    cy.get('input[name="password"]').type('password')
    cy.get('button[type="submit"]').click()

    //click first book button
    cy.get('button.book-service').first().click()

    //book appointment
    cy.intercept('GET', 'http://127.0.0.1:8000/api/services/*').as('serviceRequest')
    cy.wait('@serviceRequest')

    cy.get('.select-date input').click()
    cy.get('.select-date div.dp__calendar_item:not([aria-disabled="true"])').first().click();

    cy.get('.select-hour select').find('option').first().then(option => { cy.get('.select-hour select').select(option.val()); });

    cy.get('.select-minute select').find('option').first().then(option => { cy.get('.select-minute select').select(option.val()); });

    cy.get('button.button-book').click()

    cy.wait(1000)


    cy.get('.swal2-popup', { timeout: 5000 }).should('be.visible')

    cy.contains('Reservation booked successfully').should('be.visible')
  })
})
