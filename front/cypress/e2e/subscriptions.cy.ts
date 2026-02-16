/// <reference types="cypress" />

const apiUrl = (): string => {
  const fromEnv: unknown = Cypress.env('apiUrl');
  return typeof fromEnv === 'string' && fromEnv.length > 0 ? fromEnv : 'http://localhost:8080/api';
};

const apiAuthHeaders = (): { Authorization: string } => {
  const tokenUnknown: unknown = Cypress.env('token');
  const token = typeof tokenUnknown === 'string' ? tokenUnknown : '';
  expect(token).to.be.a('string');
  expect(token.length).to.be.greaterThan(0);
  return { Authorization: `Bearer ${token}` };
};

describe('Subscriptions (E2E)', () => {
  const login = 'test';
  const password = 'Password123!';

  beforeEach(() => {
    cy.apiRegisterIfNeeded(login, password);
    cy.apiLogin(login, password);
  });

  it('Permet de basculer abonnement/désabonnement via l’UI (Topics page)', () => {
    cy.intercept('GET', '**/api/users/me').as('getMe');
    cy.intercept('GET', '**/api/topics').as('getTopics');
    cy.intercept('POST', '**/api/subscriptions/*').as('subscribe');
    cy.intercept('DELETE', '**/api/subscriptions/*').as('unsubscribe');

    cy.visit('/topics');

    cy.wait('@getMe').its('response.statusCode').should('eq', 200);
    cy.wait('@getTopics').its('response.statusCode').should('eq', 200);

    // On accepte les 2 libellés : apostrophe typographique (’) ou simple (')
    const subscribeLabels = ["S’abonner", "S'abonner"];
    const unsubscribeLabels = ["Se désabonner", "Se desabonner", "Se désabonner", "Se desabonner"];

    // Cherche un bouton "S'abonner" (si l'utilisateur n'est pas abonné partout)
    cy.get('body').then(($body) => {
      const hasSubscribe =
        subscribeLabels.some((label) => $body.find(`button:contains("${label}")`).length > 0);

      if (hasSubscribe) {
        // Cas normal : on s'abonne puis on se désabonne
        cy.contains('button', /S[’']abonner/).first().click();
        cy.wait('@subscribe').its('response.statusCode').should('be.oneOf', [200, 201, 204]);
        cy.contains('Abonnement effectué').should('be.visible');

        cy.contains('button', /Se d[ée]sabonner/).first().click();
        cy.wait('@unsubscribe').its('response.statusCode').should('be.oneOf', [200, 204]);
        cy.contains('Désabonnement effectué').should('be.visible');
        return;
      }

      // Sinon : l'utilisateur est probablement déjà abonné partout -> on force un "toggle"
      const hasUnsubscribe =
        unsubscribeLabels.some((label) => $body.find(`button:contains("${label}")`).length > 0);

      expect(hasUnsubscribe).to.eq(true);

      // On se désabonne d'abord pour faire apparaître ensuite "S'abonner"
      cy.contains('button', /Se d[ée]sabonner/).first().click();
      cy.wait('@unsubscribe').its('response.statusCode').should('be.oneOf', [200, 204]);
      cy.contains('Désabonnement effectué').should('be.visible');

      // Puis on se ré-abonne
      cy.contains('button', /S[’']abonner/).first().click();
      cy.wait('@subscribe').its('response.statusCode').should('be.oneOf', [200, 201, 204]);
      cy.contains('Abonnement effectué').should('be.visible');
    });
  });

  it('Le topic abonné apparaît dans /me > Abonnements (contrôle back->UI)', () => {
    cy.request({
      method: 'GET',
      url: `${apiUrl()}/topics`,
      headers: apiAuthHeaders(),
    }).then((resp) => {
      expect(resp.status).to.eq(200);

      const bodyUnknown: unknown = resp.body;
      const topics: TopicApi[] = Array.isArray(bodyUnknown) ? (bodyUnknown as TopicApi[]) : [];
      expect(topics.length).to.be.greaterThan(0);

      const topicId = topics[0].id;
      const topicName = topics[0].name;

      expect(topicId).to.be.a('number');
      expect(topicName).to.be.a('string');

      cy.request({
        method: 'POST',
        url: `${apiUrl()}/subscriptions/${topicId}`,
        headers: apiAuthHeaders(),
        failOnStatusCode: false,
      }).then((r) => {
        // 409 si déjà abonné -> OK
        expect([200, 201, 204, 409]).to.include(r.status);
      });

      cy.intercept('GET', '**/api/users/me').as('getMe');
      cy.visit('/me');

      cy.wait('@getMe').its('response.statusCode').should('eq', 200);

      cy.contains('h1', 'Abonnements').should('be.visible');
      cy.contains('.card-title', topicName).should('be.visible');
    });
  });
});
