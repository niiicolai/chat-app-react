/// <reference types="cypress" />
import { faker } from '@faker-js/faker';

describe('Room Settings E2E Test', () => {
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
        const room_name = `room_name_${Date.now()}`;
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

    it('the edit room settings buttion should be visible', () => {
        cy.get('[data-testid="room-options-room-settings"]').should('be.visible');
    });

    it('submitting the edit room settings form without a join message should show an error', () => {
        cy.get('[data-testid="room-options-room-settings"]').click();
        cy.get('[data-testid="room-settings-edit-form"] input[name="join_message"]').clear();
        cy.get('[data-testid="room-settings-edit-form"] button[type="submit"]').click();
        cy.get('[data-testid="toast-item-message"]').should('be.visible').and('contain', 'Join message is required');
    });

    it ('submitting the edit room settings form without a join message including {name} should show an error', () => {
        cy.get('[data-testid="room-options-room-settings"]').click();
        cy.get('[data-testid="room-settings-edit-form"] input[name="join_message"]').clear();
        cy.get('[data-testid="room-settings-edit-form"] input[name="join_message"]').type('Hello');
        cy.get('[data-testid="room-settings-edit-form"] button[type="submit"]').click();
        cy.get('[data-testid="toast-item-message"]').should('be.visible').and('contain', 'Join message must contain {name}');
    });

    it('submitting the edit room settings form without rules text should show an error', () => {
        cy.get('[data-testid="room-options-room-settings"]').click();
        
        cy.get('[data-testid="room-settings-edit-form"] textarea[name="rules_text"]').clear();
        cy.get('[data-testid="room-settings-edit-form"] button[type="submit"]').click();
        cy.get('[data-testid="toast-item-message"]').should('be.visible').and('contain', 'Rules text is required');
    });

    it('submitting the edit room settings form with valid data should update the room settings', () => {
        cy.get('[data-testid="room-options-room-settings"]').click();
        cy.get('[data-testid="room-settings-edit-form"] textarea[name="rules_text"]').type('New rules');
        cy.get('[data-testid="room-settings-edit-form"] button[type="submit"]').click();
        cy.get('[data-testid="toast-item-message"]').should('be.visible').and('contain', 'Room settings updated successfully');
    });

    it('the rules page should be updated with the new rules text', () => {
        cy.get('[data-testid="channel-list-show-rules-button"]').click();
        cy.get('[data-testid="room-rules-text-output"]').should('be.visible').and('contain', 'New rules');
    });

    it('submitting the edit room settings form with a valid channel uuid should update the room settings', () => {
        // Create a channel before running the tests
        const channel_name = `channel_name_${Date.now()}`;
        const channel_description = 'A channel description';
        const channel_type = 'Text';
        cy.get('[data-testid="room-options-create-channel"]').click();
        cy.get('[data-testid="channel-create-form"] input[name="name"]').type(channel_name);
        cy.get('[data-testid="channel-create-form"] input[name="description"]').type(channel_description);
        cy.get('[data-testid="channel-create-form"] select[name="channel_type_name"]').select(channel_type);
        cy.get('[data-testid="channel-create-form"] button[type="submit"]').click();
        cy.get('[data-testid="toast-item-message"]').should('be.visible').and('contain', 'Channel created successfully');

        // Update the room settings
        cy.get('[data-testid="room-options-room-settings"]').click();
        cy.get('[data-testid="room-settings-edit-form"] select[name="join_channel_uuid"]').select(channel_name);
        cy.get('[data-testid="room-settings-edit-form"] button[type="submit"]').click();
        cy.get('[data-testid="toast-item-message"]').should('be.visible').and('contain', 'Room settings updated successfully');
    });
});
