/// <reference types="cypress" />

describe('Login E2E Test', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/login');
  });

  it('the email input must exists and be of type email', () => {
    cy.get('input[name="email"]').should('have.attr', 'type', 'email');
  });

  it('the password input exists and must be of type password', () => {
    cy.get('input[name="password"]').should('have.attr', 'type', 'password');
  });

  it('shows a link to the signup page', () => {
    cy.get('a[href="/signup"]').should('be.visible');
  });

  it('shows an error if the email input is empty', () => {
    cy.get('input[name="password"]').type('12345678');

    cy.get('button[type="submit"]').click();

    cy.get('[data-testid="toast-item-message"]')
      .should('be.visible')
      .and('contain', 'Email is required');
  });

  it('shows an error if the password input is empty', () => {
    cy.get('input[name="email"]').type('admin@example.com');

    cy.get('button[type="submit"]').click();

    cy.get('[data-testid="toast-item-message"]')
      .should('be.visible')
      .and('contain', 'Password is required');
  });

  it('successfully logs in with valid credentials', () => {
    cy.get('input[name="email"]').type('admin@example.com'); 
    cy.get('input[name="password"]').type('12345678');

    cy.get('button[type="submit"]').click();

    cy.url().should('eq', 'http://localhost:5173/');
    cy.get('[data-testid="browse-rooms-button"]')
      .should('be.visible');
  });
  
  it('shows an error message for invalid credentials', () => {
    cy.get('input[name="email"]').type('invalid@mail.com');
    cy.get('input[name="password"]').type('invalidPassword');

    cy.get('button[type="submit"]').click();

    cy.get('[data-testid="alert-message"]')
      .should('be.visible')
      .and('contain', 'Error: Invalid email or password');
  });
});
