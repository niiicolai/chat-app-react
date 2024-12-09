/// <reference types="cypress" />
import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from "uuid";

const uuid = uuidv4();
const room_name = `room_name_${Date.now()}`;
const username2 = `user_2${Date.now()}`;

describe('Join Room E2E Test', () => {
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

        // Create an invite link before running the tests
        cy.get('[data-testid="room-options-invite-links"]').click();
        cy.get('[data-testid="room-invite-link-create-button"]').click();
        cy.get('[data-testid="room-invite-link-create-form"] input[name="uuid"]').invoke('val', uuid).trigger('change', { force: true });
        cy.get('[data-testid="room-invite-link-create-form"] button[type="submit"]').click();
        cy.get('[data-testid="toast-item-message"]').should('be.visible').and('contain', 'Invite link created successfully');
    
        // Sign up another user
        cy.visit('http://localhost:5173/signup');
        cy.get('input[name="username"]').type(username2);
        cy.get('input[name="email"]').type(`user_2${Date.now()}@example.com`);
        cy.get('input[name="password"]').type(randomPassword);
        cy.get('button[type="submit"]').click();
        cy.url().should('eq', 'http://localhost:5173/');
    });

    beforeEach(() => {
        cy.restoreLocalStorage();
    });

    afterEach(() => {
        cy.saveLocalStorage();
    });

    it('visiting the invite link as another user should join the room', () => {
        // visit the invite link
        cy.visit(`http://localhost:5173/room/${uuid}/join`);
        cy.get('[data-testid="join-room-welcome-message"]').should('be.visible').and('contain', `Welcome to ${room_name}`);

        // visit the room
        cy.visit('http://localhost:5173/');
        cy.get('[data-testid="browse-rooms-button"]').click();
        cy.get('[data-testid="room-list-item-button"]').first().click();
        cy.get('[data-testid="room-header-title"]').should('be.visible').and('contain', room_name);
        cy.get('[data-testid="room-options-users"]').click();
        cy.get('[data-testid="room-user-list"]').children().should('have.length', 2);
    });

    it('visiting the invite link again should show an error', () => {
        cy.visit(`http://localhost:5173/room/${uuid}/join`);
        cy.get('[data-testid="room-join-alert-message"]').should('be.visible').and('contain', 'User already in room');
    });

    it('a welcome message should be displayed in the channel', () => {
        cy.visit('http://localhost:5173/');
        cy.get('[data-testid="browse-rooms-button"]').click();
        cy.get('[data-testid="room-list-item-button"]').first().click();
        cy.get('[data-testid="channel-list-item-button"]').first().click();
        cy.get('[data-testid="channel-message-list-item-body"]').should('be.visible').and('contain', `${username2} entered the room!`);
    });
});
