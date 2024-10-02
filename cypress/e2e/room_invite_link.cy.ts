/// <reference types="cypress" />
import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from "uuid";

const room_name = `room_name_${Date.now()}`;
const expires_at_tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 19);

describe('Room Invite Link E2E Test', () => {
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

         // Create a room before running the tests
         const room_description = 'A room description';
         const room_category = 'General';
         cy.get('[data-testid="show-create-room-button"]').click();
         cy.get('[data-testid="room-create-form"] input[name="name"]').type(room_name);
         cy.get('[data-testid="room-create-form"] input[name="description"]').type(room_description);
         cy.get('[data-testid="room-create-form"] select[name="room_category_name"]').select(room_category);
         cy.get('[data-testid="room-create-form"] button[type="submit"]').click();
         cy.get('[data-testid="toast-item-message"]').should('be.visible').and('contain', 'Room created successfully');
    });

    beforeEach(() => {
        cy.restoreLocalStorage();
        cy.visit('http://localhost:5173/');

        // Open the room
        cy.get('[data-testid="browse-rooms-button"]').click();
        cy.get('[data-testid="room-list-item-button"]').first().click();
    });

    afterEach(() => {
        cy.saveLocalStorage();
    });

    it('the browse room invite link button should be visible', () => {
        cy.get('[data-testid="room-options-invite-links"]').should('be.visible');
    });

    it('clicking the browse room invite link button should show an empty list', () => {
        cy.get('[data-testid="room-options-invite-links"]').click();
        cy.get('[data-testid="room-invite-link-list-empty"]').should('be.visible');
    });

    it('the browse room invite link modal should contain a create button', () => {
        cy.get('[data-testid="room-options-invite-links"]').click();
        cy.get('[data-testid="room-invite-link-create-button"]').should('be.visible');
    });

    it('clicking the create button should show the create form', () => {
        cy.get('[data-testid="room-options-invite-links"]').click();
        cy.get('[data-testid="room-invite-link-create-button"]').click();
        cy.get('[data-testid="room-invite-link-create-form"]').should('be.visible');
    });

    it('submitting the create form without expires_at should be successful', () => {
        cy.get('[data-testid="room-options-invite-links"]').click();
        cy.get('[data-testid="room-invite-link-create-button"]').click();
        cy.get('[data-testid="room-invite-link-create-form"] button[type="submit"]').click();
        cy.get('[data-testid="toast-item-message"]').should('be.visible').and('contain', 'Invite link created successfully');
    });

    it('submitting the create form with expires_at should be successful', () => {
        
        cy.get('[data-testid="room-options-invite-links"]').click();
        cy.get('[data-testid="room-invite-link-create-button"]').click();
        cy.get('[data-testid="room-invite-link-create-form"] input[name="expires_at"]').type(expires_at_tomorrow);
        cy.get('[data-testid="room-invite-link-create-form"] button[type="submit"]').click();
        cy.get('[data-testid="toast-item-message"]').should('be.visible').and('contain', 'Invite link created successfully');
    });

    it('submitting the create form with a date in the past should show an error', () => {
        const expires_at_yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 19);
        cy.get('[data-testid="room-options-invite-links"]').click();
        cy.get('[data-testid="room-invite-link-create-button"]').click();
        cy.get('[data-testid="room-invite-link-create-form"] input[name="expires_at"]').type(expires_at_yesterday);
        cy.get('[data-testid="room-invite-link-create-form"] button[type="submit"]').click();
        cy.get('[data-testid="room-invite-link-create-alert-message"]').should('be.visible').and('contain', 'The expiration date cannot be in the past');
    });

    it('the browse room invite link modal should contain two room-invite-link-list-item', () => {
        cy.get('[data-testid="room-options-invite-links"]').click();
        cy.get('[data-testid="room-invite-link-list-item"]').should('have.length', 2);
        cy.get('[data-testid="room-invite-link-list-empty"]').should('not.exist');
    });

    it('the browse room invite link items should contain a copy button', () => {
        cy.get('[data-testid="room-options-invite-links"]').click();
        cy.get('[data-testid="room-invite-link-list-item"]').first().find('[data-testid="room-invite-link-copy-button"]').should('be.visible');
    });

    it('clicking the copy button should copy the invite link to the clipboard', () => {
        cy.get('[data-testid="room-options-invite-links"]').click();
        cy.get('[data-testid="room-invite-link-list-item"]').first().find('[data-testid="room-invite-link-copy-button"]').click();
        cy.get('[data-testid="toast-item-message"]').should('be.visible').and('contain', 'Invite link copied to clipboard');
    });

    it('the browse room invite link items should contain an edit button', () => {
        cy.get('[data-testid="room-options-invite-links"]').click();
        cy.get('[data-testid="room-invite-link-list-item"]').first().find('[data-testid="room-invite-link-edit-button"]').should('be.visible');
    });

    it('the browse room invite link items should contain a delete button', () => {
        cy.get('[data-testid="room-options-invite-links"]').click();
        cy.get('[data-testid="room-invite-link-list-item"]').first().find('[data-testid="room-invite-link-delete-button"]').should('be.visible');
    });

    it('clicking the edit button should show the edit form', () => {
        cy.get('[data-testid="room-options-invite-links"]').click();
        cy.get('[data-testid="room-invite-link-list-item"]').first().find('[data-testid="room-invite-link-edit-button"]').click();
        cy.get('[data-testid="room-invite-link-edit-form"]').should('be.visible');
    });

    it('submitting the edit form without expires_at should be successful', () => {
        cy.get('[data-testid="room-options-invite-links"]').click();
        cy.get('[data-testid="room-invite-link-list-item"]').first().find('[data-testid="room-invite-link-edit-button"]').click();
        cy.get('[data-testid="room-invite-link-edit-form"] button[type="submit"]').click();
        cy.get('[data-testid="toast-item-message"]').should('be.visible').and('contain', 'Invite link updated successfully');
    });

    it('submitting the edit form with expires_at should be successful', () => {
        cy.get('[data-testid="room-options-invite-links"]').click();
        cy.get('[data-testid="room-invite-link-list-item"]').first().find('[data-testid="room-invite-link-edit-button"]').click();
        cy.get('[data-testid="room-invite-link-edit-form"] input[name="expires_at"]').type(expires_at_tomorrow);
        cy.get('[data-testid="room-invite-link-edit-form"] button[type="submit"]').click();
        cy.get('[data-testid="toast-item-message"]').should('be.visible').and('contain', 'Invite link updated successfully');
    });

    it('submitting the edit form with a date in the past should show an error', () => {
        const expires_at_yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 19);
        cy.get('[data-testid="room-options-invite-links"]').click();
        cy.get('[data-testid="room-invite-link-list-item"]').first().find('[data-testid="room-invite-link-edit-button"]').click();
        cy.get('[data-testid="room-invite-link-edit-form"] input[name="expires_at"]').type(expires_at_yesterday);
        cy.get('[data-testid="room-invite-link-edit-form"] button[type="submit"]').click();
        cy.get('[data-testid="room-invite-link-edit-alert-message"]').should('be.visible').and('contain', 'The expiration date cannot be in the past');
    });

    it('clicking the delete button should show a confirmation modal', () => {
        cy.get('[data-testid="room-options-invite-links"]').click();
        cy.get('[data-testid="room-invite-link-list-item"]').first().find('[data-testid="room-invite-link-delete-button"]').click();
        cy.get('[data-testid="room-invite-link-delete-modal"]').should('be.visible');
    });

    it('clicking the cancel button in the delete modal should close the modal', () => {
        cy.get('[data-testid="room-options-invite-links"]').click();
        cy.get('[data-testid="room-invite-link-list-item"]').first().find('[data-testid="room-invite-link-delete-button"]').click();
        cy.get('[data-testid="room-invite-link-delete-modal"]').find('[data-testid="room-invite-link-delete-cancel-button"]').click();
        cy.get('[data-testid="room-invite-link-delete-modal"]').should('not.exist');
    });

    it('clicking the confirm button in the delete modal should throw an error if the answer input does not contain "yes"', () => {
        cy.get('[data-testid="room-options-invite-links"]').click();
        cy.get('[data-testid="room-invite-link-list-item"]').first().find('[data-testid="room-invite-link-delete-button"]').click();
        cy.get('[data-testid="room-invite-link-delete-modal"]').find('[data-testid="room-invite-link-delete-confirm-button"]').click();
        cy.get('[data-testid="toast-item-message"]').should('be.visible').and('contain', 'Please confirm deletion by typing "yes"');
    });

    it('clicking the confirm button in the delete modal should delete the invite link after typing "yes"', () => {
        cy.get('[data-testid="room-options-invite-links"]').click();
        cy.get('[data-testid="room-invite-link-list-item"]').first().find('[data-testid="room-invite-link-delete-button"]').click();
        cy.get('[data-testid="room-invite-link-delete-modal"]').find('#room-invite-link-delete-answer').type('yes');
        cy.get('[data-testid="room-invite-link-delete-modal"]').find('[data-testid="room-invite-link-delete-confirm-button"]').click();
        cy.get('[data-testid="toast-item-message"]').should('be.visible').and('contain', 'Invite link deleted successfully');
    });    
});
