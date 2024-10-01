/// <reference types="cypress" />
import { faker } from '@faker-js/faker';

describe('Signup E2E Test', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5173/signup');
    });

    it('the username input must exists and be of type text', () => {
        cy.get('input[name="username"]').should('have.attr', 'type', 'text');
    });

    it('the email input must exists and be of type email', () => {
        cy.get('input[name="email"]').should('have.attr', 'type', 'email');
    });

    it('the password input must exists and  be of type password', () => {
        cy.get('input[name="password"]').should('have.attr', 'type', 'password');
    });

    it('shows a link to the login page', () => {
        cy.get('a[href="/login"]').should('be.visible');
    });

    it('shows an error if the email input is empty', () => {
        cy.get('input[name="password"]').type('12345678');
        cy.get('input[name="username"]').type('admin');

        cy.get('button[type="submit"]').click();

        cy.get('[data-testid="alert-message"]')
            .should('be.visible')
            .and('contain', 'Email is required');
    });

    it('shows an error if the password input is empty', () => {
        cy.get('input[name="email"]').type('admin@example.com');
        cy.get('input[name="username"]').type('admin');

        cy.get('button[type="submit"]').click();

        cy.get('[data-testid="alert-message"]')
            .should('be.visible')
            .and('contain', 'Password is required');
    });

    it('shows an error if the username input is empty', () => {
        cy.get('input[name="email"]').type('admin@example.com');
        cy.get('input[name="password"]').type('12345678');

        cy.get('button[type="submit"]').click();

        cy.get('[data-testid="alert-message"]')
            .should('be.visible')
            .and('contain', 'Username is required');
    });

    it('successfully signup in with valid credentials', () => {
        const uniqueUsername = `user_${Date.now()}`;
        const uniqueEmail = `user_${Date.now()}@example.com`;
        const randomPassword = faker.internet.password({ length: 10 });

        cy.get('input[name="username"]').type(uniqueUsername);
        cy.get('input[name="email"]').type(uniqueEmail);
        cy.get('input[name="password"]').type(randomPassword);

        cy.get('button[type="submit"]').click();

        cy.url().should('eq', 'http://localhost:5173/');
        cy.get('[data-testid="toast-item-message"]')
            .should('be.visible')
            .and('contain', 'Welcome back!');
    });
});
