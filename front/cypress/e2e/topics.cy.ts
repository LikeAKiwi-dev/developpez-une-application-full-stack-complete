/// <reference types="cypress" />

describe('Topics', () => {
  it('Displays the list of topics from the database via the back', () => {

    cy.intercept('GET', '**/api/users/me', {
      statusCode: 200,
      body: { id: 1, username: 'test' },
    }).as('me');

    cy.intercept('GET', '**/api/topics').as('getTopicsApi');

    cy.visit('/topics');

    cy.wait('@getTopicsApi').its('response.statusCode').should('eq', 200);

    cy.get('li').should('have.length.greaterThan', 0);
    cy.contains('li', 'Java').should('be.visible');
    cy.contains('li', 'JavaScript').should('be.visible');
    cy.contains('li', 'Python').should('be.visible');
  });
});
