describe('Login Page', () => {
  it('logs in successfully with correct credentials', () => {
    // Visit login page
    cy.visit('/login')

    // Fill login form
    cy.get('input[name="email"]').type('client@onet.pl')
    cy.get('input[name="password"]').type('password')

    // Submit form
    cy.get('button[type="submit"]').click()


    // Verify redirect or success message
    cy.url().should('include', '/') // Example
    cy.contains('Mam fachowca')
  })

  it('shows error on invalid credentials', () => {
    // cy.wait(500)
    cy.visit('/login')

    cy.get('input[name="email"]').type('wronguser@onet.pl')
    cy.get('input[name="password"]').type('wrongpass')
    cy.get('button[type="submit"]').click()

    cy.contains('Invalid credentials').should('be.visible')
  })
})
