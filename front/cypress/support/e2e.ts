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

const apiUrl = (): string => {
  const fromEnv: unknown = Cypress.env('apiUrl');
  return typeof fromEnv === 'string' && fromEnv.length > 0 ? fromEnv : 'http://localhost:8080/api';
};

Cypress.Commands.add('apiRegisterIfNeeded', (login: string, password: string) => {
  cy.request({
    method: 'POST',
    url: `${apiUrl()}/auth/register`,
    body: { email: `${login}@test.local`, username: login, password },
    failOnStatusCode: false,
  });
});

Cypress.Commands.add('apiLogin', (login: string, password: string) => {
  cy.request({
    method: 'POST',
    url: `${apiUrl()}/auth/login`,
    body: { login, password },
    failOnStatusCode: false,
  }).then((res) => {
    expect(res.status).to.eq(200);

    const body: LoginResponse = (res.body ?? {}) as LoginResponse;

    const token =
      body.token ??
      body.accessToken ??
      body.jwt ??
      body.data?.token ??
      body.data?.accessToken;

    expect(token).to.be.a('string');

    Cypress.env('token', token);

    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem('token', token);
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
