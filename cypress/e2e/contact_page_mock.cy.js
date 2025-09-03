describe('contact_page', () => {
  it('contact_page', () => {

    cy.visit('/contact')

    cy.get('input#name').type('Kamil Nowak');
    cy.get('input#email').type('kamil.nowak@onet.pl');
    cy.get('textarea#message').type('Treść wiadomości email');

    cy.get('button[type="submit"]').click();

    cy.wait(3000)

    cy.changeLanguage('en')

    cy.contains('Message sent successfully!').click();



  })
})
