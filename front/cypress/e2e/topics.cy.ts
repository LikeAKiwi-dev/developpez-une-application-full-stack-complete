/// <reference types="cypress" />

type TopicApi = { id: number; name: string };

describe('Topics (E2E)', () => {
  const login = 'test';
  const password = 'Password123!';

  beforeEach(() => {
    cy.apiRegisterIfNeeded(login, password);
    cy.apiLogin(login, password);
  });

  it('Charge les topics depuis le back et affiche les cards', () => {
    cy.intercept('GET', '**/api/users/me').as('getMe');
    cy.intercept('GET', '**/api/topics').as('getTopics');

    cy.visit('/topics');

    cy.wait('@getMe').its('response.statusCode').should('eq', 200);

    cy.wait('@getTopics').then((interception) => {
      expect(interception.response?.statusCode).to.eq(200);

      const bodyUnknown: unknown = interception.response?.body;
      const topics: TopicApi[] = Array.isArray(bodyUnknown) ? (bodyUnknown as TopicApi[]) : [];

      expect(topics.length).to.be.greaterThan(0);

      // Ton HTML affiche les noms dans .card-title (pas des <li>)
      topics.slice(0, 3).forEach((t) => {
        expect(t.name).to.be.a('string');
        cy.contains('.card-title', t.name).should('be.visible');
      });
    });
  });
});
