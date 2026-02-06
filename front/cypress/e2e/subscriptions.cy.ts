/// <reference types="cypress" />

describe('Subscribe (Topics)', () => {
  const login = 'test';
  const password = 'Password123!';

  beforeEach(() => {
    cy.apiRegisterIfNeeded(login, password);
    cy.apiLogin(login, password);
  });

  it("'Unsubscribe' poster on a topic to which I am subscribed (forced state)", () => {
    cy.request({
      method: 'GET',
      url: 'http://localhost:8080/api/topics',
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200);

      const topics = res.body as Array<{ id: number; name: string }>;
      expect(topics.length).to.be.greaterThan(0);

      const topicId = topics[0].id;
      const topicName = topics[0].name;

      cy.request({
        method: 'POST',
        url: `http://localhost:8080/api/subscriptions/${topicId}`,
        failOnStatusCode: false,
      }).then((subRes) => {
        expect([200, 201, 204, 409]).to.include(subRes.status);

        cy.intercept('GET', '**/api/topics').as('getTopics');
        cy.visit('/topics');
        cy.wait('@getTopics');

        cy.contains('li', topicName)
          .should('be.visible')
          .within(() => cy.contains(/se désabonner/i).should('be.visible'));
      });
    });
  });

  it('Displays the list of topics and allows you to (un)subscribe', () => {
    cy.intercept('GET', '**/api/topics').as('getTopics');

    cy.intercept('POST', '**/api/subscriptions/*').as('toggleSub');
    cy.intercept('DELETE', '**/api/subscriptions/*').as('toggleSub');

    cy.visit('/topics');
    cy.wait('@getTopics').its('response.statusCode').should('eq', 200);

    cy.get('li').first().as('firstTopic');

    cy.get('@firstTopic').within(() => {
      cy.get('button').then(($btn) => {
        const label = ($btn.text() || '').toLowerCase();

        cy.wrap($btn).click();
        cy.wait('@toggleSub').its('response.statusCode').should('be.oneOf', [200, 201, 204, 409]);

        if (label.includes('désabonn')) {
          cy.contains(/s[’']abonner|abonner/i).should('be.visible');
        } else {
          cy.contains(/se désabonner|désabonn/i).should('be.visible');
        }
      });
    });
  });

  it('Allows you to filter only the topics I am subscribed to (if filter present)', () => {
    cy.intercept('GET', '**/api/topics').as('getTopics');

    cy.visit('/topics');

    cy.wait('@getTopics').then((interception) => {
      const body = (interception.response?.body ?? []) as Array<{
        id: number;
        name: string;
        subscribers?: Array<{ id: number; username: string }>;
      }>;

      const subscribedNames = body
        .filter((t) => (t.subscribers ?? []).some((s) => s.username === login))
        .map((t) => t.name);

      cy.get('body').then(($body) => {
        const $btn = $body
          .find('button')
          .filter((_, el) =>
            /mes abonn|abonnés uniquement|abonnements|abonnés/i.test(
              (el.textContent ?? '').toLowerCase()
            )
          );

        if (!$btn.length) {
          cy.log('No "my subscriptions" filter present in the UI → test skipped.');
          return;
        }

        cy.wrap($btn.first()).click();

        cy.get('li').each(($li) => {
          const liText = $li.text();
          const match = subscribedNames.some((name) => liText.includes(name));
          expect(match, `topic affiché doit être abonné: "${liText}"`).to.eq(true);
        });

        if (subscribedNames.length > 0) {
          cy.get('li').each(($li) => {
            cy.wrap($li).contains(/se désabonner|désabonn/i).should('be.visible');
          });
        }
      });
    });
  });
});
