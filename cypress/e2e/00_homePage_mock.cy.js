describe('homePage', () => {
  it('homePage loading properly', () => {

    cy.visit('/') // Vue dev server
    cy.contains('Mam fachowca')
  })

  it('load_more_services_on_scroll', () => {

    cy.visit('/')

    cy.get('div.ad-tile').should('have.length', 10); // adjust to initial count

    // Scroll to bottom
    cy.get('div.scrollContainer').scrollTo('bottom');

    // Wait for new ads to load (adjust API wait if needed)
    cy.get('div.ad-tile').should('have.length.greaterThan', 10);

  })
})
