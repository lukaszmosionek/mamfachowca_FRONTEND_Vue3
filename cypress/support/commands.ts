/// <reference types="cypress" />

// This will run before every test
Cypress.on('window:before:load', (win) => {
  // Remove the DevTools overlay if it exists
  win.document.addEventListener('DOMContentLoaded', () => {
    const devToolsBtn = win.document.querySelector('.vue-devtools__anchor-btn');
    if (devToolsBtn) {
      devToolsBtn.remove();
    }
  });
});

Cypress.Commands.add('login', (email = 'client@onet.pl', password = 'password') => {
    cy.visit('/login') // visit login page
    cy.get('input[name="email"]').type(email)
    cy.get('input[name="password"]').type(password)
    cy.get('button[type="submit"]').click()
})

Cypress.Commands.add('changeLanguage', (changeTo='pl') => {

  cy.visit('/')

  cy.get('button#changeLanguage-' + changeTo).then(($btn) => {
    if ($btn.length === 1) {
      $btn.click();
    }
  });

})



beforeEach(() => {
  cy.visit('/', {
    onBeforeLoad(win) {
      win.localStorage.setItem('useValidationsKey', 'true');
    },
  });
});

afterEach(() => {
  cy.visit('/', {
    onBeforeLoad(win) {
      win.localStorage.removeItem('useValidationsKey');
    },
  });
});

