/// <reference types="cypress" />
interface LoginResponse {
  token?: string;
  accessToken?: string;
  jwt?: string;
  data?: {
    token?: string;
    accessToken?: string;
  };
  message?: string;
}

Cypress.Commands.add('apiRegisterIfNeeded', (login: string, password: string) => {
  cy.request({
    method: 'POST',
    url: 'http://localhost:8080/api/auth/register',
    body: { email: `${login}@test.local`, username: login, password },
    failOnStatusCode: false, // 200 ou 400 si déjà existant
  });
});
Cypress.Commands.add('apiLogin', (login: string, password: string) => {
  cy.request({
    method: 'POST',
    url: 'http://localhost:8080/api/auth/login',
    body: { login, password },
    failOnStatusCode: false,
  }).then((res) => {
    expect(res.status).to.eq(200);

    const body: LoginResponse = res.body ?? {};

    const token =
      body.token ??
      body.accessToken ??
      body.jwt ??
      body.data?.token ??
      body.data?.accessToken;

    expect(token, `Login response must contain a token. Response body: ${JSON.stringify(body)}`).to.be.a('string');

    Cypress.env('token', token);

    cy.visit('/', {
      onBeforeLoad(win) {
        const windowRef = win as unknown as Window;
        windowRef.localStorage.setItem('token', token as string);
      },
    });
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
