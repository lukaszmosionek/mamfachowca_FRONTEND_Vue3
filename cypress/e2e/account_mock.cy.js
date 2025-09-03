describe('account', () => {
  it('account', () => {

    //login
    cy.login('provider@onet.pl', 'password') // reusable login in support/commands.ts

    cy.get('a[href="/account"]').click();

    // cy.get('#uploadAvatar').attachFile('avatar.png');
    cy.get('input[type="file"]#fileUpload').attachFile('avatar.png');

    cy.get('input#name').clear().type('Provider changed in cypress test');
    cy.get('input#email').clear().type('provider@onet.pl');
    // cy.get('.input#email').type('provider@onet.pl');

    cy.get('button[type="submit"]').click();

    cy.contains('OK');

  })
})
