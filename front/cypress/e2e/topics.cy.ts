/// <reference types="cypress" />

describe('Topics', () => {
  it('affiche la liste des topics depuis la BDD via le back', () => {
    // Intercepte l'appel qui traverse front -> back -> BDD
    cy.intercept('GET', '**/topics').as('getTopics');

    cy.visit('/topics');

    // On attend la réponse HTTP du backend
    cy.wait('@getTopics')
      .its('response.statusCode')
      .should('eq', 200);

    // Vérifie que la liste est visible et contient au moins 1 item
    cy.get('ul li').should('have.length.greaterThan', 0);

    // Vérifie des valeurs "connues" (si seed BDD = Java, JavaScript, Python)
    cy.contains('li', 'Java').should('be.visible');
    cy.contains('li', 'JavaScript').should('be.visible');
    cy.contains('li', 'Python').should('be.visible');
  });
});
