/// <reference types="cypress" />
import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from "uuid";

const uuid = uuidv4();
const room_name = `room_name_${Date.now()}`;
const username2 = `user_2${Date.now()}`;
const uniqueUsername = `user_${Date.now()}`;

describe('Room User as Admin E2E Test', () => {
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

        // visit the invite link to join the other user to the room
        cy.visit(`http://localhost:5173/room/${uuid}/join`);
        cy.get('[data-testid="join-room-welcome-message"]').should('be.visible').and('contain', `Welcome to ${room_name}`);
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

    it('the room users button should be visible in the room', () => {
        cy.get('[data-testid="room-options-users"]').should('be.visible');
    });

    it('clicking the room users button should show the room users list with two users', () => {
        cy.get('[data-testid="room-options-users"]').click();
        cy.get('[data-testid="room-user-list"]').should('be.visible');
        cy.get('[data-testid="room-user-list"] li').should('have.length', 2);
    });

    it('the role and kick buttons should not be visible in the room users list', () => {
        cy.get('[data-testid="room-options-users"]').click();
        // Ensure none of the list items contains the role and kick buttons
        cy.get('[data-testid="room-user-li-username"]').contains(uniqueUsername).parent().parent().parent().within(() => {
            // check if the li where data-testid="room-user-li-username" contains the uniqueUsername
            // has an element where data-testid="room-user-li-role-name" contains "Admin"
            cy.get('[data-testid="room-user-li-role-name"]').should('contain', 'Admin');
            // role and kick buttons should have the class hidden
            cy.get('[data-testid="set-room-user-admin"]').should('have.class', 'hidden');
            cy.get('[data-testid="set-room-user-mod"]').should('have.class', 'hidden');
            cy.get('[data-testid="set-room-user-member"]').should('have.class', 'hidden');
        });
        cy.get('[data-testid="room-user-li-username"]').contains(username2).parent().parent().parent().within(() => {
            // check if the li where data-testid="room-user-li-username" contains the username2
            // has an element where data-testid="room-user-li-role-name" contains "Member"
            cy.get('[data-testid="room-user-li-role-name"]').should('contain', 'Member');
            // role and kick buttons should not exist
            cy.get('[data-testid="set-room-user-admin"]').should('not.exist');
            cy.get('[data-testid="set-room-user-mod"]').should('not.exist');
            cy.get('[data-testid="set-room-user-member"]').should('not.exist');
        });
    });
});
