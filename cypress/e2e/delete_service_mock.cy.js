describe('Delete service', () => {
  it('delete service', () => {

    //login
    cy.login('provider@onet.pl', 'password') // reusable login in support/commands.ts

    cy.wait(1000)

    cy.visit('/my-services')

    cy.wait(1000)

    // cy.intercept('GET', `${Cypress.env('backendUrl')}/me/services`).as('serviceRequest');
    // cy.wait('@serviceRequest')

    cy.get('button.delete-service').first().click()

    cy.wait(1000)
    cy.get('button.swal2-confirm').first().click()



    // cy.get('img[src*="storage/photos"][alt="Name of service"]').then(($images) => {
    //   expect($images.length).to.be.at.least(2);
    // });

  })
})
