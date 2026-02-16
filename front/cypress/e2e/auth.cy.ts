/// <reference types="cypress" />

describe('Auth (E2E)', () => {
  const login = 'test';
  const password = 'Password123!';

  it('Se connecte via l’UI et redirige vers /feed', () => {
    cy.apiRegisterIfNeeded(login, password);

    cy.intercept('POST', '**/api/auth/login').as('loginReq');

    cy.visit('/login');

    cy.get('input[formcontrolname="login"]').type(login);
    cy.get('input[formcontrolname="password"]').type(password);

    cy.get('form').submit();

    cy.wait('@loginReq').its('response.statusCode').should('eq', 200);

    cy.location('pathname').should('eq', '/feed');
  });

  it('Affiche une erreur si mauvais mot de passe', () => {
    cy.apiRegisterIfNeeded(login, password);

    cy.intercept('POST', '**/api/auth/login').as('loginReq');

    cy.visit('/login');

    cy.get('input[formcontrolname="login"]').type(login);
    cy.get('input[formcontrolname="password"]').type('WrongPassword!');

    cy.get('form').submit();

    cy.wait('@loginReq').its('response.statusCode').should('eq', 401);

    cy.contains('Identifiants invalides (ou back non joignable).').should('be.visible');
    cy.location('pathname').should('eq', '/login');
  });
});
