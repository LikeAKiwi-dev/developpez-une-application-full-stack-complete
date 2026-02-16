/// <reference types="cypress" />

describe('Me (Profile)', () => {
  const login = 'test';
  const password = 'Password123!';

  beforeEach(() => {
    cy.apiRegisterIfNeeded(login, password);
    cy.apiLogin(login, password);
  });

  it('Loads my profile via the back and displays basic info', () => {
    cy.intercept('GET', '**/api/users/me').as('getMe');

    cy.visit('/me');

    cy.wait('@getMe').its('response.statusCode').should('eq', 200);

    cy.contains(/Profile utilisateur/i).should('be.visible');
    cy.get('input[formcontrolname="username"]').should('have.value', login);
    cy.get('input[formcontrolname="email"]').should('have.value', `${login}@test.local`);
    cy.contains(/Abonnements/i).should('be.visible');
  });
});
