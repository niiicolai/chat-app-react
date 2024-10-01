/// <reference types="cypress" />
import { faker } from '@faker-js/faker';

const room_name = `room_name_${Date.now()}`;
const room_description = 'A room description';
const room_category = 'General';
const updated_room_name = `updated_${room_name}`;
const updated_room_description = `updated_${room_description}`;

describe('Room E2E Test', () => {
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

    it('clicking the browse rooms button shows an empty list for rooms', () => {
        cy.get('[data-testid="browse-rooms-button"]').should('be.visible');
        cy.get('[data-testid="browse-rooms-button"]').click();
        cy.get('[data-testid="room-list"]').should('be.visible');
        cy.get('[data-testid="room-list-empty"]').should('be.visible');
    });

    it('clicking the create room button shows the create room form', () => {
        cy.get('[data-testid="show-create-room-button"]').should('be.visible');
        cy.get('[data-testid="show-create-room-button"]').click();
        cy.get('[data-testid="room-create-form"]').should('be.visible');
    });

    it('the create room form shows an error if the name input is empty', () => {
        cy.get('[data-testid="show-create-room-button"]').click();
        cy.get('[data-testid="room-create-form"] input[name="description"]').type(room_description);
        cy.get('[data-testid="room-create-form"] select[name="room_category_name"]').select(room_category);

        cy.get('[data-testid="room-create-form"] button[type="submit"]').click();
        cy.get('[data-testid="room-create-alert-message"]').should('be.visible').and('contain', 'Name is required');
    });

    it('the create room form shows an error if the description input is empty', () => {
        cy.get('[data-testid="show-create-room-button"]').click();
        cy.get('[data-testid="room-create-form"] input[name="name"]').type('Room Name');
        cy.get('[data-testid="room-create-form"] select[name="room_category_name"]').select(room_category);

        cy.get('[data-testid="room-create-form"] button[type="submit"]').click();
        cy.get('[data-testid="room-create-alert-message"]').should('be.visible').and('contain', 'Description is required');
    });

    it('successfully creates a room with valid inputs', () => {
        cy.get('[data-testid="show-create-room-button"]').click();
        cy.get('[data-testid="room-create-form"] input[name="name"]').type(room_name);
        cy.get('[data-testid="room-create-form"] input[name="description"]').type(room_description);
        cy.get('[data-testid="room-create-form"] select[name="room_category_name"]').select(room_category);

        cy.get('[data-testid="room-create-form"] button[type="submit"]').click();
        cy.get('[data-testid="toast-item-message"]').should('be.visible').and('contain', 'Room created successfully');
    });

    it('clicking the browse rooms button shows a list with one room', () => {
        cy.get('[data-testid="browse-rooms-button"]').click();
        cy.get('[data-testid="room-list"]').should('be.visible');
        cy.get('[data-testid="room-list-item"]').should('be.visible');
        cy.get('[data-testid="room-list-empty"]').should('not.exist');
    });

    it('clicking the list item shown in the browse rooms list shows the room details', () => {
        cy.get('[data-testid="browse-rooms-button"]').click();
        cy.get('[data-testid="room-list-item-button"]').first().click();
        cy.get('[data-testid="room-header-title"]').should('be.visible').and('contain', room_name);
        cy.get('[data-testid="room-header-category"]').should('be.visible').and('contain', room_category);
        cy.get('[data-testid="room-options-create-channel"]').should('be.visible');
        cy.get('[data-testid="room-options-users"]').should('be.visible');
        cy.get('[data-testid="room-options-files"]').should('be.visible');
        cy.get('[data-testid="room-options-invite-links"]').should('be.visible');
        cy.get('[data-testid="room-options-webhooks"]').should('be.visible');
        cy.get('[data-testid="room-options-room-settings"]').should('be.visible');
        cy.get('[data-testid="room-options-edit-room"]').should('be.visible');
        cy.get('[data-testid="room-options-delete-room"]').should('be.visible');
        cy.get('[data-testid="channel-list-empty"]').should('be.visible');
        cy.get('[data-testid="channel-main-no-channel-selected"]').should('be.visible');
    });

    it('clicking the edit room button shows the edit room form with the room details', () => {
        cy.get('[data-testid="browse-rooms-button"]').click();
        cy.get('[data-testid="room-list-item-button"]').first().click();
        cy.get('[data-testid="room-options-edit-room"]').click();
        cy.get('[data-testid="room-edit-form"]').should('be.visible');
        cy.get('[data-testid="room-edit-form"] input[name="name"]').should('have.value', room_name);
        cy.get('[data-testid="room-edit-form"] input[name="description"]').should('have.value', room_description);
        cy.get('[data-testid="room-edit-form"] select[name="room_category_name"]').should('have.value', room_category);
    });

    it('the edit room form shows an error if the name input is empty', () => {
        cy.get('[data-testid="browse-rooms-button"]').click();
        cy.get('[data-testid="room-list-item-button"]').first().click();
        cy.get('[data-testid="room-options-edit-room"]').click();
        cy.get('[data-testid="room-edit-form"] input[name="name"]').clear();
        cy.get('[data-testid="room-edit-form"] button[type="submit"]').click();
        cy.get('[data-testid="room-edit-alert-message"]').should('be.visible').and('contain', 'Name is required');
    });

    it('the edit room form shows an error if the description input is empty', () => {
        cy.get('[data-testid="browse-rooms-button"]').click();
        cy.get('[data-testid="room-list-item-button"]').first().click();
        cy.get('[data-testid="room-options-edit-room"]').click();
        cy.get('[data-testid="room-edit-form"] input[name="description"]').clear();
        cy.get('[data-testid="room-edit-form"] button[type="submit"]').click();
        cy.get('[data-testid="room-edit-alert-message"]').should('be.visible').and('contain', 'Description is required');
    });

    it('successfully updates a room with valid inputs', () => {

        cy.get('[data-testid="browse-rooms-button"]').click();
        cy.get('[data-testid="room-list-item-button"]').first().click();
        cy.get('[data-testid="room-options-edit-room"]').click();
        cy.get('[data-testid="room-edit-form"] input[name="name"]').clear().type(updated_room_name);
        cy.get('[data-testid="room-edit-form"] input[name="description"]').clear().type(updated_room_description);
        cy.get('[data-testid="room-edit-form"] button[type="submit"]').click();
        cy.get('[data-testid="toast-item-message"]').should('be.visible').and('contain', 'Room updated successfully');
    });

    it('clicking the delete room button shows the delete room confirmation modal', () => {
        cy.get('[data-testid="browse-rooms-button"]').click();
        cy.get('[data-testid="room-list-item-button"]').first().click();
        cy.get('[data-testid="room-options-delete-room"]').click();
        cy.get('[data-testid="room-delete-modal"]').should('be.visible');
        cy.get('[data-testid="room-delete-confirm-description"]').should('be.visible').and('contain', updated_room_name);
        cy.get('[data-testid="room-delete-modal"] input[name="confirm"]').should('be.visible');
        cy.get('[data-testid="room-delete-cancel-button"]').should('be.visible');
        cy.get('[data-testid="room-delete-confirm-button"]').should('be.visible');
    });

    it('clicking the cancel button hides the delete room confirmation modal', () => {
        cy.get('[data-testid="browse-rooms-button"]').click();
        cy.get('[data-testid="room-list-item-button"]').first().click();
        cy.get('[data-testid="room-options-delete-room"]').click();
        cy.get('[data-testid="room-delete-cancel-button"]').click();
        cy.get('[data-testid="room-delete-modal"]').should('not.visible');
    });

    it('clicking the confirm button shows an error if the confirm input does not match the room name', () => {
        cy.get('[data-testid="browse-rooms-button"]').click();
        cy.get('[data-testid="room-list-item-button"]').first().click();
        cy.get('[data-testid="room-options-delete-room"]').click();
        cy.get('[data-testid="room-delete-modal"] input[name="confirm"]').type('invalid');
        cy.get('[data-testid="room-delete-confirm-button"]').click();
        cy.get('[data-testid="toast-item-message"]').should('be.visible').and('contain', 'Room name does not match');
    });

    it('successfully deletes a room after confirming the deletion', () => {
        cy.get('[data-testid="browse-rooms-button"]').click();
        cy.get('[data-testid="room-list-item-button"]').first().click();
        cy.get('[data-testid="room-options-delete-room"]').click();
        cy.get('[data-testid="room-delete-modal"] input[name="confirm"]').type(updated_room_name);
        cy.get('[data-testid="room-delete-confirm-button"]').click();
        cy.get('[data-testid="toast-item-message"]').should('be.visible').and('contain', 'Room deleted successfully');
    });

    it('the browse rooms list is empty after deleting the room', () => {
        cy.get('[data-testid="browse-rooms-button"]').click();
        cy.get('[data-testid="room-list-empty"]').should('be.visible');
    });
});
