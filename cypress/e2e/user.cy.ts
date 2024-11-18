/// <reference types="cypress" />
import { faker } from '@faker-js/faker';

describe('User E2E Test', () => {
    before(() => {
        // Sign up a random user before running the tests
        cy.visit('http://localhost:5173/signup');
        const uniqueUsername = `user_${Date.now()}`;
        const uniqueEmail = `user_${Date.now()}@example.com`;
        const randomPassword = faker.internet.password({ length: 10 });
        cy.get('input[name="username"]').type(uniqueUsername);
        cy.get('input[name="email"]').type(uniqueEmail);
        cy.get('input[name="password"]').type(randomPassword);
        cy.get('button[type="submit"]').click();
        cy.url().should('eq', 'http://localhost:5173/');
    });

    beforeEach(() => {
        cy.restoreLocalStorage();
        cy.visit('http://localhost:5173/');
    });

    afterEach(() => {
        cy.saveLocalStorage();
    });

    it('the edit user button should be visible', () => {
        cy.get('[data-testid="edit-profile-button"]').should('be.visible');
    });

    it('clicking the edit user button should open the edit user modal', () => {
        cy.get('[data-testid="edit-profile-button"]').click();
        cy.get('[data-testid="edit-user-form"]').should('be.visible');
    });

    it('changing the user details should update the user', () => {
        cy.get('[data-testid="edit-profile-button"]').click();
        cy.get('#user-edit-username').clear().type(`updated_username${Date.now()}`);
        cy.get('#user-edit-email').clear().type(`updated_email${Date.now()}@example.com`);
        cy.get('#user-edit-password').clear().type('updated_password');
        cy.get('[data-testid="edit-user-form"]').submit();
        cy.get('[data-testid="toast-item-message"]').should('be.visible').and('contain', 'User updated');
    });
});
