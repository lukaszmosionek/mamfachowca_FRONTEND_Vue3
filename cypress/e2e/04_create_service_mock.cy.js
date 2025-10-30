//04_create_service_mock.cy.js
describe('Create service', () => {
  it('Create service', () => {

    //login
    cy.login('provider@onet.pl', 'password') // reusable login in support/commands.ts

    cy.get('a[href="/account"]').realHover()
    cy.get('a[href="/my-services"]').first().should('be.visible').click()

    cy.wait(1000)

    cy.get('h1#logo').realHover()

    cy.get('a.add-new').click()

    cy.get('input.input-name').eq(0).type('Name of service en')  // first input
    cy.get('input.input-name').eq(1).type('Name of service pl')  // second input
    cy.get('input.input-price').type('999')
    cy.get('input.input-duration-minutes').clear().type(120)
    cy.get('textarea.input-description').eq(0).type('Description of service en')  // first input
    cy.get('textarea.input-description').eq(1).type('Description of service pl')  // second input

    cy.get('input[type="file"]').attachFile('service-photo-3.jpg').attachFile('service-photo-4.jpg');

    cy.get('button[type="submit"]').first().click()

    cy.get('button.swal2-confirm').first().click()


    cy.get('a.link-home').first().click()

    cy.changeCurrency('PLN');

    cy.contains(/Name of service (en|pl)/).should('be.visible');
    cy.contains(/Description of service (en|pl)/).should('be.visible')
    cy.contains('120').should('be.visible')
    cy.contains('999').should('be.visible')

    cy.get('img[src*="storage/photos"]').filter((_, img) => /Name of service (en|pl)/.test(img.alt)).then(($images) => {
      expect($images.length).to.be.at.least(2);
    });

  })

  it('Check validation with empty fields', () => {

    //login
    cy.login('provider@onet.pl', 'password') // reusable login in support/commands.ts

    cy.get('a[href="/account"]').realHover();
    cy.get('a[href="/my-services"]').first().should('be.visible').click()

    cy.get('a.add-new').click()

    cy.get('button[type="submit"]').first().click()


    cy.contains('validation.serviceName.required').should('be.visible')
    cy.contains('validation.price.required').should('be.visible')
    cy.contains('validation.time.positive').should('be.visible')
    cy.contains('validation.description.required').should('be.visible')
  })


})
