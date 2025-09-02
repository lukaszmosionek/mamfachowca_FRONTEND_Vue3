describe('Register Page', () => {
  it('register in successfully with correct credentials', () => {
    // Visit login page
    cy.visit('/register')

    // Fill login form
    cy.get('input[name="name"]').type('Marc Due')
    cy.get('input[name="email"]').type('client'+Math.random()+'@onet.pl')
    cy.get('input[name="password"]').type('password234,./A')
    cy.get('input[name="password_confirmation"]').type('password234,./A')

    // Submit form
    cy.get('button[type="submit"]').click()


    // Verify redirect or success message
    cy.url().should('include', '/') // Example
    cy.contains('Mam fachowca')
  })

  // it('shows error on invalid credentials', () => {
  //   cy.visit('http://localhost:5173/login')

    //   cy.get('input[name="name"]').type('Marc Due')
    //   cy.get('input[name="email"]').type('client@onet.pl')
    //   cy.get('input[name="password"]').type('password234,./A')
    //   cy.get('input[name="password_confirmation"]').type('password234,./A')
    // cy.get('button[type="submit"]').click()

  //   cy.contains('Invalid credentials').should('be.visible')
  // })
})
