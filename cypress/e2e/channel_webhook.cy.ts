/// <reference types="cypress" />
import { faker } from '@faker-js/faker';



describe('Channel Webhook E2E Test', () => {
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

    it('the browse channel webhook button must be visible', () => {
        cy.get('[data-testid="room-options-webhooks"]').should('be.visible');
    });

    it('when clicking the browse channel webhook button, the channel webhook list should be empty', () => {
        cy.get('[data-testid="room-options-webhooks"]').click();
        cy.get('[data-testid="channel-webhook-list-empty"]').should('be.visible').and('contain', 'No channel webhooks found');
        cy.get('[data-testid="channel-webhook-create-button"]').should('be.visible');        
    });

    it('when clicking the create channel webhook button, the create channel webhook form should be visible', () => {
        cy.get('[data-testid="room-options-webhooks"]').click();
        cy.get('[data-testid="channel-webhook-create-button"]').click();
        cy.get('[data-testid="channel-webhook-create-form"]').should('be.visible');
    });

    it('when submitting the create channel webhook form, without a channel should display an error message', () => {
        cy.get('[data-testid="room-options-webhooks"]').click();
        cy.get('[data-testid="channel-webhook-create-button"]').click();
        cy.get('[data-testid="channel-webhook-create-form"] input[name="name"]').type('name');
        cy.get('[data-testid="channel-webhook-create-form"] input[name="description"]').type('description');
        cy.get('[data-testid="channel-webhook-create-form"] button[type="submit"]').click();
        cy.get('[data-testid="toast-item-message"]').should('be.visible').and('contain', 'Channel is required');
    });

    it('when submitting the create channel webhook form, without a name should display an error message', () => {
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
        
        cy.get('[data-testid="room-options-webhooks"]').click();
        cy.get('[data-testid="channel-webhook-create-button"]').click();
        cy.get('[data-testid="channel-webhook-create-form"] button[type="submit"]').click();
        cy.get('[data-testid="toast-item-message"]').should('be.visible').and('contain', 'Name is required');
    });

    it('when submitting the create channel webhook form, without a description should display an error message', () => {
        cy.get('[data-testid="room-options-webhooks"]').click();
        cy.get('[data-testid="channel-webhook-create-button"]').click();
        cy.get('[data-testid="channel-webhook-create-form"] input[name="name"]').type('name');
        cy.get('[data-testid="channel-webhook-create-form"] button[type="submit"]').click();
        cy.get('[data-testid="toast-item-message"]').should('be.visible').and('contain', 'Description is required');
    });

    it('when submitting the create channel webhook form, with valid data should create a channel webhook', () => {
        cy.get('[data-testid="room-options-webhooks"]').click();
        cy.get('[data-testid="channel-webhook-create-button"]').click();
        cy.get('[data-testid="channel-webhook-create-form"] input[name="name"]').type('name');
        cy.get('[data-testid="channel-webhook-create-form"] input[name="description"]').type('description');
        cy.get('[data-testid="channel-webhook-create-form"] button[type="submit"]').click();
        cy.get('[data-testid="toast-item-message"]').should('be.visible').and('contain', 'Channel webhook created');
    });

    it('when submitting the create channel webhook form to a channel already in use an error message should be displayed', () => {
        cy.get('[data-testid="room-options-webhooks"]').click();
        cy.get('[data-testid="channel-webhook-create-button"]').click();
        cy.get('[data-testid="channel-webhook-create-form"] input[name="name"]').type('name');
        cy.get('[data-testid="channel-webhook-create-form"] input[name="description"]').type('description');
        // expect uncaught exception
        cy.on('uncaught:exception', (err, runnable) => {
            cy.get('[data-testid="channel-webhook-create-form"] button[type="submit"]').click();
            expect(err.message).to.include('Channel webhook already exists');
            return false;
        });
    });

    it('the browse channel webhook list should contain the created channel webhook', () => {
        cy.get('[data-testid="room-options-webhooks"]').click();
        cy.get('[data-testid="channel-webhook-list-item"]').should('be.visible');
        cy.get('[data-testid="channel-webhook-test-button"]').should('be.visible');
        cy.get('[data-testid="channel-webhook-edit-button"]').should('be.visible');
        cy.get('[data-testid="channel-webhook-delete-button"]').should('be.visible');
    });

    it('when clicking the test channel webhook button, the test channel webhook form should be visible', () => {
        cy.get('[data-testid="room-options-webhooks"]').click();
        cy.get('[data-testid="channel-webhook-test-button"]').click();
        cy.get('[data-testid="channel-webhook-test-form"]').should('be.visible');
    });

    it('when submitting the test channel webhook form, without a message should display an error message', () => {
        cy.get('[data-testid="room-options-webhooks"]').click();
        cy.get('[data-testid="channel-webhook-test-button"]').click();
        cy.get('[data-testid="channel-webhook-test-form"] button[type="submit"]').click();
        cy.get('[data-testid="toast-item-message"]').should('be.visible').and('contain', 'Message is required');
    });

    it('when submitting the test channel webhook form, with a message should send a test message', () => {
        cy.get('[data-testid="room-options-webhooks"]').click();
        cy.get('[data-testid="channel-webhook-test-button"]').click();
        cy.get('[data-testid="channel-webhook-test-form"] input[name="message"]').type('message');
        cy.get('[data-testid="channel-webhook-test-form"] button[type="submit"]').click();
        cy.get('[data-testid="toast-item-message"]').should('be.visible').and('contain', 'Webhook test sent');
    });

    it('the channel should contain the test message from the webhook', () => {
        cy.get('[data-testid="channel-list-item-button"]').click();
        cy.get('[data-testid="channel-message-list-item-username"]').should('be.visible').and('contain', 'name');
        cy.get('[data-testid="channel-message-list-item-body"]').should('be.visible').and('contain', 'message');
    });

    it('when clicking the edit channel webhook button, the edit channel webhook form should be visible', () => {
        cy.get('[data-testid="room-options-webhooks"]').click();
        cy.get('[data-testid="channel-webhook-edit-button"]').click();
        cy.get('[data-testid="channel-webhook-edit-form"]').should('be.visible');
    });

    it ('the edit channel webhook form should contain the current channel webhook data', () => {
        cy.get('[data-testid="room-options-webhooks"]').click();
        cy.get('[data-testid="channel-webhook-edit-button"]').click();
        cy.get('[data-testid="channel-webhook-edit-form"] input[name="name"]').should('have.value', 'name');
        cy.get('[data-testid="channel-webhook-edit-form"] input[name="description"]').should('have.value', 'description');
    });

    it('when submitting the edit channel webhook form, without a name should display an error message', () => {
        cy.get('[data-testid="room-options-webhooks"]').click();
        cy.get('[data-testid="channel-webhook-edit-button"]').click();
        cy.get('[data-testid="channel-webhook-edit-form"] input[name="name"]').clear();
        cy.get('[data-testid="channel-webhook-edit-form"] button[type="submit"]').click();
        cy.get('[data-testid="toast-item-message"]').should('be.visible').and('contain', 'Name is required');
    });

    it('when submitting the edit channel webhook form, without a description should display an error message', () => {
        cy.get('[data-testid="room-options-webhooks"]').click();
        cy.get('[data-testid="channel-webhook-edit-button"]').click();
        cy.get('[data-testid="channel-webhook-edit-form"] input[name="description"]').clear();
        cy.get('[data-testid="channel-webhook-edit-form"] button[type="submit"]').click();
        cy.get('[data-testid="toast-item-message"]').should('be.visible').and('contain', 'Description is required');
    });

    it('when submitting the edit channel webhook form, with valid data should update the channel webhook', () => {
        cy.get('[data-testid="room-options-webhooks"]').click();
        cy.get('[data-testid="channel-webhook-edit-button"]').click();
        cy.get('[data-testid="channel-webhook-edit-form"] input[name="name"]').clear().type('new_name');
        cy.get('[data-testid="channel-webhook-edit-form"] input[name="description"]').clear().type('new_description');
        cy.get('[data-testid="channel-webhook-edit-form"] button[type="submit"]').click();
        cy.get('[data-testid="toast-item-message"]').should('be.visible').and('contain', 'Channel webhook updated');
    });

    it('when clicking the delete channel webhook button, the delete channel webhook modal should be visible', () => {
        cy.get('[data-testid="room-options-webhooks"]').click();
        cy.get('[data-testid="channel-webhook-delete-button"]').click();
        cy.get('[data-testid="channel-webhook-delete-modal"]').should('be.visible');
    });

    it('when clicking the cancel delete channel webhook button, the delete channel webhook modal should be hidden', () => {
        cy.get('[data-testid="room-options-webhooks"]').click();
        cy.get('[data-testid="channel-webhook-delete-button"]').click();
        cy.get('[data-testid="channel-webhook-delete-cancel-button"]').click();
        cy.get('[data-testid="channel-webhook-delete-modal"]').should('not.exist');
    });

    it('when confirming the delete channel webhook modal, a error should be thrown if the provided name does not match', () => {
        cy.get('[data-testid="room-options-webhooks"]').click();
        cy.get('[data-testid="channel-webhook-delete-button"]').click();
        cy.get('[data-testid="channel-webhook-delete-modal"] input[name="name"]').type('invalid_name');
        cy.get('[data-testid="channel-webhook-delete-confirm-button"]').click();
        cy.get('[data-testid="toast-item-message"]').should('be.visible').and('contain', 'The provided name must match: new_name');
    });

    it('when confirming the delete channel webhook modal, the channel webhook should be deleted', () => {
        cy.get('[data-testid="room-options-webhooks"]').click();
        cy.get('[data-testid="channel-webhook-delete-button"]').click();
        cy.get('[data-testid="channel-webhook-delete-modal"] input[name="name"]').type('new_name');
        cy.get('[data-testid="channel-webhook-delete-confirm-button"]').click();
        cy.get('[data-testid="toast-item-message"]').should('be.visible').and('contain', 'Channel webhook deleted');
    });

    it('the browse channel webhook list should be empty', () => {
        cy.get('[data-testid="room-options-webhooks"]').click();
        cy.get('[data-testid="channel-webhook-list-empty"]').should('be.visible').and('contain', 'No channel webhooks found');
        cy.get('[data-testid="channel-webhook-create-button"]').should('be.visible');
    });
});
