/// <reference types="cypress" />

// This will run before every test
Cypress.on('window:before:load', (win) => {
  // Remove the DevTools overlay if it exists
  win.document.addEventListener('DOMContentLoaded', () => {
    const devToolsBtn = win.document.querySelector('.vue-devtools__anchor-btn, #__vue-devtools-container__, #vue-inspector-container, .vue-devtools__panel');
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

  cy.get('body').then(($body) => {
    if ($body.find('button#changeLanguage-' + changeTo).length) {
      cy.get('button#changeLanguage-' + changeTo).click();
    }
  });

})

beforeEach(() => {
  cy.visit('/', {
    onBeforeLoad(win) {
      win.localStorage.setItem('useValidationsKey', 'true');
      win.localStorage.setItem('vueDevtoolsDisabled', 'true');
    },
  });
});

afterEach(() => {
  cy.visit('/', {
    onBeforeLoad(win) {
      win.localStorage.removeItem('useValidationsKey');
      win.localStorage.removeItem('vueDevtoolsDisabled');
    },
  });
});
