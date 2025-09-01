describe('Create service', () => {
  it('Create service', () => {

    //login
    cy.visit('/login')
    cy.get('input[name="email"]').type('provider@onet.pl')
    cy.get('input[name="password"]').type('password')
    cy.get('button[type="submit"]').click()

    cy.wait(1000)

    cy.visit('/my-services')
    //click first book button
    // cy.get('a.add-new[href="/my-services"]').click()
    cy.wait(1000)
    //book appointment
    // cy.intercept('GET', 'http://127.0.0.1:8000/api/services/*').as('serviceRequest')
    // cy.wait('@serviceRequest')

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
