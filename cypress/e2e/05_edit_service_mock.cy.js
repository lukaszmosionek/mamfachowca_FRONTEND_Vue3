describe('Edit service', () => {
  it('Edit service', () => {

    //login
    cy.login('provider@onet.pl', 'password') // reusable login in support/commands.ts

    cy.wait(1000)

    cy.visit('/my-services')

    cy.wait(1000)

    // cy.intercept('GET', `${Cypress.env('backendUrl')}/me/services`).as('serviceRequest');
    // cy.wait('@serviceRequest')

    cy.get('a.edit-service').first().click()

    cy.get('input.input-name').type('Name of service')
    cy.get('input.input-price').type('999')
    cy.get('input.input-duration-minutes').clear().type(120)
    cy.get('textarea.input-description').type('Description of service')

    cy.get('input[type="file"]').attachFile('service-photo-3.jpg').attachFile('service-photo-4.jpg');

    cy.get('button[type="submit"]').first().click()

    cy.get('button.swal2-confirm').first().click()


    cy.get('a.link-home').first().click()

    cy.contains('Name of service').should('be.visible')
    cy.contains('Description of service').should('be.visible')
    cy.contains('120').should('be.visible')
    cy.contains('999').should('be.visible')

    cy.get('img[src*="storage/photos"][alt="Name of service"]').then(($images) => {
      expect($images.length).to.be.at.least(2);
    });

  })
})
