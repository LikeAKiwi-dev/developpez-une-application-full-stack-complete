/// <reference types="cypress" />
describe('Posts + Comments (E2E)', () => {
  const login = 'test';
  const password = 'Password123!';

  beforeEach(() => {
    cy.apiRegisterIfNeeded(login, password);
    cy.apiLogin(login, password);
  });

  it('Crée un post, revient au feed, ouvre le détail et ajoute un commentaire', () => {
    cy.intercept('GET', '**/api/topics').as('getTopics');
    cy.intercept('POST', '**/api/posts').as('createPost');

    // IMPORTANT: le feed = /api/feed (pas /api/posts)
    cy.intercept('GET', '**/api/feed').as('getFeed');

    cy.intercept('GET', '**/api/posts/*').as('getPostDetail');

    // IMPORTANT: commentaire = /api/posts/:id/comments
    cy.intercept('POST', '**/api/posts/*/comments').as('addComment');

    const title = `Post Cypress ${Date.now()}`;
    const content = 'Contenu de test Cypress.';
    const comment = 'Commentaire Cypress.';

    // 1) Création
    cy.visit('/posts/new');

    cy.wait('@getTopics').then((interception) => {
      expect(interception.response?.statusCode).to.eq(200);

      const bodyUnknown: unknown = interception.response?.body;
      const topics: TopicApi[] = Array.isArray(bodyUnknown) ? (bodyUnknown as TopicApi[]) : [];
      expect(topics.length).to.be.greaterThan(0);

      const firstTopicName = topics[0].name;
      expect(firstTopicName).to.be.a('string');

      // ngValue => on sélectionne par le texte
      cy.get('select[formcontrolname="topicId"]').select(firstTopicName);
    });

    cy.get('input[formcontrolname="title"]').type(title);
    cy.get('textarea[formcontrolname="content"]').type(content);
    cy.get('form').submit();

    cy.wait('@createPost').its('response.statusCode').should('be.oneOf', [200, 201]);

    // 2) Feed
    cy.visit('/feed');
    cy.wait('@getFeed').its('response.statusCode').should('eq', 200);

    // Post = <a class="card">
    cy.contains('a.card', title).click();

    // 3) Détail + commentaire
    cy.wait('@getPostDetail').its('response.statusCode').should('eq', 200);

    cy.get('textarea[formcontrolname="content"]').type(comment);
    cy.get('form.comment-form').submit();

    cy.wait('@addComment').its('response.statusCode').should('be.oneOf', [200, 201]);
    cy.contains('.comment-bubble', comment).should('be.visible');
  });
});
