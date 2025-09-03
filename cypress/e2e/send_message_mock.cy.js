describe('send_message', () => {
  it('send_message', () => {

      cy.login('client@onet.pl', 'password') // reusable login in support/commands.ts

      cy.get('.send-message').first().click();
      cy.get('input#message').type('Tresc testowej wiadomosc');

      cy.get('button#send-message[type="submit"]').click();

      cy.contains('Message sent successfully');

  })
})
