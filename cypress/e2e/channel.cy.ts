/// <reference types="cypress" />
import { faker } from '@faker-js/faker';

const channel_name = `channel_name_${Date.now()}`;
const channel_description = 'A channel description';
const channel_type = 'Text';
const updated_channel_name = `updated_channel_name_${Date.now()}`;
const updated_channel_description = 'An updated channel description';

describe('Channel E2E Test', () => {
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

    it('the room should have no channels initially', () => {
        cy.get('[data-testid="channel-list-empty"]').should('be.visible');
    });

    it('the room should not have a channel selected initially', () => {
        cy.get('[data-testid="channel-main-no-channel-selected"]').should('be.visible');
    });

    it('the create channel button should be visible', () => {
        cy.get('[data-testid="room-options-create-channel"]').should('be.visible');
    });

    it('clicking the create channel button shows the create channel form', () => {
        cy.get('[data-testid="room-options-create-channel"]').click();
        cy.get('[data-testid="channel-create-form"]').should('be.visible');
    });

    it('the create channel form shows an error if the name input is empty', () => {
        cy.get('[data-testid="room-options-create-channel"]').click();
        cy.get('[data-testid="channel-create-form"] button[type="submit"]').click();
        cy.get('[data-testid="toast-item-message"]').should('be.visible').and('contain', 'Name is required');
    });

    it('the create channel form shows an error if the description input is empty', () => {
        cy.get('[data-testid="room-options-create-channel"]').click();
        cy.get('[data-testid="channel-create-form"] input[name="name"]').type(channel_name);
        cy.get('[data-testid="channel-create-form"] button[type="submit"]').click();
        cy.get('[data-testid="toast-item-message"]').should('be.visible').and('contain', 'Description is required');
    });

    it('successfully creates a channel with valid inputs', () => {
        cy.get('[data-testid="room-options-create-channel"]').click();
        cy.get('[data-testid="channel-create-form"] input[name="name"]').type(channel_name);
        cy.get('[data-testid="channel-create-form"] input[name="description"]').type(channel_description);
        cy.get('[data-testid="channel-create-form"] select[name="channel_type_name"]').select(channel_type);
        cy.get('[data-testid="channel-create-form"] button[type="submit"]').click();
        cy.get('[data-testid="toast-item-message"]').should('be.visible').and('contain', 'Channel created successfully');
    });

    it('the channel list should show the created channel', () => {
        cy.get('[data-testid="channel-list-item"]').should('be.visible');
        cy.get('[data-testid="channel-list-item-name"]').should('be.visible').and('contain', channel_name);
    });

    it('clicking the channel list item should show the channel details', () => {
        cy.get('[data-testid="channel-list-item-button"]').click();
        cy.get('[data-testid="channel-header"]').should('be.visible');
        cy.get('[data-testid="channel-header-description"]').should('be.visible').and('contain', channel_description);
        cy.get('[data-testid="channel-header"]').trigger('mouseover');
        cy.get('[data-testid="channel-header-edit-channel"]').should('be.visible');
        cy.get('[data-testid="channel-header-delete-channel"]').should('be.visible');
    });

    it('clicking the edit channel button shows the edit channel form', () => {
        cy.get('[data-testid="channel-list-item-button"]').click();
        cy.get('[data-testid="channel-header"]').trigger('mouseover');
        cy.get('[data-testid="channel-header-edit-channel"]').click();
        cy.get('[data-testid="channel-edit-form"]').should('be.visible');
    });

    it('the edit channel form should show the current channel details', () => {
        cy.get('[data-testid="channel-list-item-button"]').click();
        cy.get('[data-testid="channel-header"]').trigger('mouseover');
        cy.get('[data-testid="channel-header-edit-channel"]').click();
        cy.get('[data-testid="channel-edit-form"] input[name="name"]').should('have.value', channel_name);
        cy.get('[data-testid="channel-edit-form"] input[name="description"]').should('have.value', channel_description);
    });

    it('the edit channel form shows an error if the name input is empty', () => {
        cy.get('[data-testid="channel-list-item-button"]').click();
        cy.get('[data-testid="channel-header"]').trigger('mouseover');
        cy.get('[data-testid="channel-header-edit-channel"]').click();
        cy.get('[data-testid="channel-edit-form"] input[name="name"]').clear();
        cy.get('[data-testid="channel-edit-form"] button[type="submit"]').click();
        cy.get('[data-testid="toast-item-message"]').should('be.visible').and('contain', 'Name is required');
    });

    it('the edit channel form shows an error if the description input is empty', () => {
        cy.get('[data-testid="channel-list-item-button"]').click();
        cy.get('[data-testid="channel-header"]').trigger('mouseover');
        cy.get('[data-testid="channel-header-edit-channel"]').click();
        cy.get('[data-testid="channel-edit-form"] input[name="description"]').clear();
        cy.get('[data-testid="channel-edit-form"] button[type="submit"]').click();
        cy.get('[data-testid="toast-item-message"]').should('be.visible').and('contain', 'Description is required');
    });

    it('successfully updates a channel with valid inputs', () => {
        cy.get('[data-testid="channel-list-item-button"]').click();
        cy.get('[data-testid="channel-header"]').trigger('mouseover');
        cy.get('[data-testid="channel-header-edit-channel"]').click();
        cy.get('[data-testid="channel-edit-form"] input[name="name"]').clear().type(updated_channel_name);
        cy.get('[data-testid="channel-edit-form"] input[name="description"]').clear().type(updated_channel_description);
        cy.get('[data-testid="channel-edit-form"] button[type="submit"]').click();
        cy.get('[data-testid="toast-item-message"]').should('be.visible').and('contain', 'Channel updated successfully');
        cy.get('[data-testid="channel-list-item-name"]').should('be.visible').and('contain', updated_channel_name);
        cy.get('[data-testid="channel-header-description"]').should('be.visible').and('contain', updated_channel_description);
    });

    it('clicking the delete channel button shows the delete channel confirmation modal', () => {
        cy.get('[data-testid="channel-list-item-button"]').click();
        cy.get('[data-testid="channel-header"]').trigger('mouseover');
        cy.get('[data-testid="channel-header-delete-channel"]').click();
        cy.get('[data-testid="channel-delete-modal"]').should('be.visible');
        cy.get('[data-testid="channel-delete-confirm-description"]').should('be.visible').and('contain', updated_channel_name);
        cy.get('[data-testid="channel-delete-modal"] input[name="confirm"]').should('be.visible');
        cy.get('[data-testid="channel-delete-cancel-button"]').should('be.visible');
        cy.get('[data-testid="channel-delete-confirm-button"]').should('be.visible');
    });

    it('clicking the cancel button hides the delete channel confirmation modal', () => {
        cy.get('[data-testid="channel-list-item-button"]').click();
        cy.get('[data-testid="channel-header"]').trigger('mouseover');
        cy.get('[data-testid="channel-header-delete-channel"]').click();
        cy.get('[data-testid="channel-delete-cancel-button"]').click();
        cy.get('[data-testid="channel-delete-modal"]').should('not.exist');
    });

    it('clicking the confirm button shows an error if the confirm input does not match the channel name', () => {
        cy.get('[data-testid="channel-list-item-button"]').click();
        cy.get('[data-testid="channel-header"]').trigger('mouseover');
        cy.get('[data-testid="channel-header-delete-channel"]').click();
        cy.get('[data-testid="channel-delete-modal"] input[name="confirm"]').type('invalid');
        cy.get('[data-testid="channel-delete-confirm-button"]').click();
        cy.get('[data-testid="toast-item-message"]').should('be.visible').and('contain', 'Channel name does not match');
    });

    it('successfully deletes a channel after confirming the deletion', () => {
        cy.get('[data-testid="channel-list-item-button"]').click();
        cy.get('[data-testid="channel-header"]').trigger('mouseover');
        cy.get('[data-testid="channel-header-delete-channel"]').click();
        cy.get('[data-testid="channel-delete-modal"] input[name="confirm"]').type(updated_channel_name);
        cy.get('[data-testid="channel-delete-confirm-button"]').click();
        cy.get('[data-testid="toast-item-message"]').should('be.visible').and('contain', 'Channel deleted successfully');
    });

    it('the channel list should be empty after deleting the channel', () => {
        cy.get('[data-testid="channel-list-empty"]').should('be.visible');
    });
});
