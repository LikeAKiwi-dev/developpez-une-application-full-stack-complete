/// <reference types="cypress" />

describe('Topics', () => {
  const login = 'test';
  const password = 'Password123!';

  beforeEach(() => {
    cy.apiRegisterIfNeeded(login, password);
    cy.apiLogin(login, password);
  });

  it('Displays the list of topics from the database via the back', () => {
    cy.intercept('GET', '**/api/topics').as('getTopicsApi');

    cy.visit('/topics');

    cy.wait('@getTopicsApi').its('response.statusCode').should('eq', 200);

    cy.get('li').should('have.length.greaterThan', 0);
    cy.contains('li', 'Java').should('be.visible');
    cy.contains('li', 'JavaScript').should('be.visible');
    cy.contains('li', 'Python').should('be.visible');
  });
});
