/// <reference types="cypress" />

describe('Posts + Comments + Feed', () => {
  const login = 'test';
  const password = 'Password123!';

  beforeEach(() => {
    cy.apiRegisterIfNeeded(login, password);
    cy.apiLogin(login, password);
  });

  it('Displays the feed', () => {
    cy.intercept('GET', '**/api/feed').as('getFeed');

    cy.visit('/feed');
    cy.wait('@getFeed').its('response.statusCode').should('eq', 200);

    cy.get('body').should('contain.text', '');
  });

  it('Allows you to create a post and then return feed', () => {
    cy.intercept('GET', '**/api/topics').as('getTopics');
    cy.intercept('POST', '**/api/posts').as('createPost');

    cy.visit('/posts/new');

    cy.wait('@getTopics');

    cy.get('input[formcontrolname="title"]').type('Post Cypress');
    cy.get('textarea[formcontrolname="content"]').type('Contenu Cypress');

    cy.get('select[formcontrolname="topicId"]').select(1);

    cy.get('form').submit();

    cy.wait('@createPost')
      .its('response.statusCode')
      .should('be.oneOf', [200, 201]);

    cy.location('pathname').should('eq', '/feed');
  });

  it("Allows you to open a post and add a comment", () => {
    cy.intercept('GET', '**/api/feed').as('getFeed');
    cy.intercept('GET', '**/api/posts/*').as('getPost');
    cy.intercept('POST', '**/api/posts/*/comments').as('addComment');

    cy.visit('/feed');
    cy.wait('@getFeed');

    cy.get('a[href^="/posts/"]')
      .not('[href="/posts/new"]')
      .first()
      .click({ force: true });

    cy.wait('@getPost');

    cy.get('textarea[formcontrolname="content"]').type('Commentaire Cypress');
    cy.get('form').submit();

    cy.wait('@addComment')
      .its('response.statusCode')
      .should('be.oneOf', [200, 201]);

    cy.contains(/Commentaire Cypress/i).should('be.visible');
  });
});
