/// <reference types="cypress" />

type MeApi = { username: string; email: string };

describe('Me (E2E)', () => {
  const login = 'test';
  const password = 'Password123!';

  beforeEach(() => {
    cy.apiRegisterIfNeeded(login, password);
    cy.apiLogin(login, password);
  });

  it('Loads my profile via the back and displays basic info', () => {
    cy.intercept('GET', '**/api/users/me').as('getMe');

    cy.visit('/me');

    cy.wait('@getMe').then((interception) => {
      expect(interception.response?.statusCode).to.eq(200);

      const bodyUnknown: unknown = interception.response?.body;
      const me = bodyUnknown as MeApi;

      expect(me.username).to.be.a('string');
      expect(me.email).to.be.a('string');
      expect(me.email).to.include('@');

      cy.contains(/Profile utilisateur/i).should('be.visible');

      cy.get('input[formcontrolname="username"]').should('have.value', me.username);
      cy.get('input[formcontrolname="email"]').should('have.value', me.email);

      cy.contains(/Abonnements/i).should('be.visible');
    });
  });
});
