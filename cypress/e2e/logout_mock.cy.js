describe('logout', () => {
  it('logout', () => {

    //login
    cy.login('provider@onet.pl', 'password') // reusable login in support/commands.ts

    cy.location('pathname').should('eq', '/')

    cy.get('a[href="/account"]').realHover();

    cy.get('button.btn-logout').should('be.visible').click();

    cy.location('pathname').should('eq', '/login')

  })
})
