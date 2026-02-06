/// <reference types="cypress" />

Cypress.Commands.add('apiRegisterIfNeeded', (login: string, password: string) => {
  cy.request({
    method: 'POST',
    url: 'http://localhost:8080/api/auth/register',
    body: { email: `${login}@test.local`, username: login, password },
    failOnStatusCode: false,
  });
});

Cypress.Commands.add('apiLogin', (login: string, password: string) => {
  cy.request({
    method: 'POST',
    url: 'http://localhost:8080/api/auth/login',
    body: { login, password },
    failOnStatusCode: false,
  }).then((res) => {
    expect([200, 401, 403]).to.include(res.status);
  });
});

declare global {
  namespace Cypress {
    interface Chainable {
      apiRegisterIfNeeded(login: string, password: string): Chainable<void>;
      apiLogin(login: string, password: string): Chainable<void>;
    }
  }
}

export {};
