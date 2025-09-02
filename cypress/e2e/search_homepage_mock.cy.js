describe('search_homepage', () => {
  it('search_homepage', () => {

      cy.visit('/')

      cy.changeLanguage()

      cy.get('input#search-box').first().type('Name of service')

      cy.wait(2000)

      cy.get('div.ad-tile h2.service-title').contains('Name of service')
  })
})
