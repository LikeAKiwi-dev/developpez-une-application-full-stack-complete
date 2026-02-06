/// <reference types="cypress" />

describe('Auth', () => {
  const login = 'test';
  const password = 'Password123!';

  it("allows you to connect via the UI", () => {
    cy.apiRegisterIfNeeded(login, password);

    cy.intercept('POST', '**/api/auth/login').as('loginReq');

    cy.visit('/login');

    cy.get('input[formcontrolname="login"]').type(login);
    cy.get('input[formcontrolname="password"]').type(password);

    cy.get('form').submit();

    cy.wait('@loginReq')
      .its('response.statusCode')
      .should('eq', 200);

    cy.location('pathname').should('not.eq', '/login');
  });

  it("Shows an error if wrong password", () => {
    cy.intercept('POST', '**/api/auth/login').as('loginReq');

    cy.visit('/login');

    cy.get('input[formcontrolname="login"]').type(login);
    cy.get('input[formcontrolname="password"]').type('wrong');

    cy.get('form').submit();

    cy.wait('@loginReq')
      .its('response.statusCode')
      .should('be.oneOf', [401, 403]);

    cy.contains(/invalid|incorrect|erreur|mauvais|échec/i).should('be.visible');
  });
});
