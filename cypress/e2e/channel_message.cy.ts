/// <reference types="cypress" />
import { faker } from '@faker-js/faker';

const room_name = `room_name_${Date.now()}`;
const uniqueUsername = `user_${Date.now()}`;

describe('Join Room E2E Test', () => {
    before(() => {
        // Sign up a random user before running the tests
        cy.visit('http://localhost:5173/signup');
        
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

        // Open the room
        cy.get('[data-testid="browse-rooms-button"]').click();
        cy.get('[data-testid="room-list-item-button"]').first().click();


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
    });

    beforeEach(() => {
        cy.visit('http://localhost:5173/');
        cy.restoreLocalStorage();
        
        // Open the room
        cy.get('[data-testid="browse-rooms-button"]').click();
        cy.get('[data-testid="room-list-item-button"]').first().click();

        // Open the channel
        cy.get('[data-testid="channel-list-item-button"]').first().click();
    });

    afterEach(() => {
        cy.saveLocalStorage();
    });

    it('the channel message create form should be visible', () => {
        cy.get('[data-testid="channel-message-create-form"]').should('be.visible');
    });

    it('creating a channel message should show the channel message', () => {
        const message = `message_${Date.now()}`;
        cy.get('[data-testid="channel-message-create-body"]').type(message);
        cy.get('[data-testid="channel-message-create-form"]').submit();
        cy.get('[data-testid="channel-message-list-item-body"]').should('be.visible').and('contain', message);
        cy.get('[data-testid="channel-message-list-item-username"]').should('be.visible').and('contain', uniqueUsername);
    });

    it('hovering the channel message should show the channel message options', () => {
        cy.get('[data-testid="channel-message-list-item"]').first().trigger('mouseover');
        cy.get('[data-testid="edit-channel-message-button"]').should('be.visible');
        cy.get('[data-testid="delete-channel-message-button"]').should('be.visible');
    });

    it('clicking the edit channel message button should show the edit channel message form', () => {
        cy.get('[data-testid="channel-message-list-item"]').first().trigger('mouseover');
        cy.get('[data-testid="edit-channel-message-button"]').click();
        cy.get('[data-testid="channel-message-edit-form"]').should('be.visible');
    });

    it('editing the channel message should update the message', () => {
        const message = `message_${Date.now()}`;
        cy.get('[data-testid="channel-message-list-item"]').first().trigger('mouseover');
        cy.get('[data-testid="edit-channel-message-button"]').click();
        cy.get('[data-testid="channel-message-edit-body"]').clear().type(message);
        cy.get('[data-testid="channel-message-edit-form"]').submit();
        cy.get('[data-testid="channel-message-list-item-body"]').should('be.visible').and('contain', message);
    });

    it('clicking the delete channel message button should delete the message', () => {
        cy.get('[data-testid="channel-message-list-item"]').first().trigger('mouseover');
        cy.get('[data-testid="delete-channel-message-button"]').click();
        cy.get('[data-testid="channel-message-list-item"]').should('not.exist');
    });

    it('after adding five messages, the channel message list should have five messages', () => {
        for (let i = 0; i < 5; i++) {
            const message = `message_${Date.now()}_${i}`;
            cy.get('[data-testid="channel-message-create-body"]').type(message);
            cy.get('[data-testid="channel-message-create-form"]').submit();
        }
        cy.get('[data-testid="channel-message-list-item"]').should('have.length', 5);
    });
});
