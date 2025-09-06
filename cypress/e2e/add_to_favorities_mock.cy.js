describe('add to favorities (Mocked API)', () => {
  it('add to favorities', () => {


      cy.login('client@onet.pl', 'password') // reusable login in support/commands.ts

      // cy.wait('@getUsers')
      // cy.get('.add-to-favorities').first().click();

      cy.wait(2000)

      cy.get('div[data-id] .add-to-favorities').first().click()
      .closest('div[data-id]')
      .invoke('attr', 'data-id')
      .then((dataId) => {
        cy.log(`Data ID: ${dataId}`);

        cy.scrollTo('top');
        cy.get('a[href="/favorites"]').first().click();

        cy.get('div.service-tile[data-id="'+dataId+'"]').should('exist')
      });

  })
})
