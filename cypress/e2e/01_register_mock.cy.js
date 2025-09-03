describe('Register Page', () => {
  it('register in successfully with correct credentials', () => {
    // Visit login page
    cy.visit('/')

    cy.get('a[href="/register"]').click();

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

  it('shows error on invalid credentials', () => {

    cy.visit('/')
    cy.get('a[href="/register"]').click();

    cy.get('button[type="submit"]').click()

    cy.contains('Name is required.').should('be.visible')
    cy.contains('Email is required.').should('be.visible')
    cy.contains('Password is required.').should('be.visible')
    cy.contains('Password confirmation is required.').should('be.visible')
  })

    it('shows invalid email message', () => {

      cy.visit('/')
      cy.get('a[href="/register"]').click();

      cy.get('input[name="email"]').type('clientoadasdasdanetpl')
      cy.get('button[type="submit"]').click()

      cy.contains('Invalid email.').should('be.visible')

  })

  it('shows password confirmation error message', () => {

      cy.visit('/')
      cy.get('a[href="/register"]').click();

      cy.get('input[name="password"]').type('123123123A.')
      cy.get('input[name="password_confirmation"]').type('123123123A.asdadasdad')
      cy.get('button[type="submit"]').click()

      cy.contains('Password must include at least one lowercase letter.').should('be.visible')
      cy.contains('Password and password confirmation must be the same.').should('be.visible')

  })
})
