describe('homePage (Mocked API)', () => {
  it('homePage', () => {
    // Mock API response before visiting page

    // cy.intercept('GET', 'http://127.0.0.1:8000/api/test-api', {
    //   statusCode: 200,
    //   body: [
    //     { message: "Connected to API!" }
    //   ]
    // }).as('getUsers')

    cy.visit('/') // Vue dev server
    // cy.wait('@getUsers')
    // cy.get('.user-item').should('have.length', 2)
    cy.contains('Mam fachowca')
  })
})
