import ApiService, { BuilderResponse, BuilderMethods } from "./apiService";
import { validate as uuidValidate } from 'uuid';
import RoomInviteLink from "../models/room_invite_link";

/**
 * @interface RoomInviteLinkResponse
 * @description The room invite link response
 * @param {RoomInviteLink} data - The room invite link
 */
interface RoomInviteLinkResponse extends BuilderResponse {
    data: RoomInviteLink;
}

/**
 * @interface RoomInviteLinksResponse
 * @description The room invite links response
 * @param {RoomInviteLink[]} data - room invite links
 */
interface RoomInviteLinksResponse extends BuilderResponse {
    data: {
        data: RoomInviteLink[];
    };
}

/**
 * @interface RoomInviteLinkCreateInput
 * @description The room invite link create input
 * @param {string} uuid - The invite link uuid
 * @param {string} room_uuid - The room uuid
 * @param {string} expires_at - The invite link expiration date
 */
export interface RoomInviteLinkCreateInput {
    uuid: string;
    room_uuid: string;
    expires_at: string;
}

/**
 * @interface RoomInviteLinkUpdateInput
 * @description The room invite link update input
 * @param {string} expires_at - The invite link expiration date
 */
export interface RoomInviteLinkUpdateInput {
    expires_at: string;
}

/**
 * @class RoomInviteLinkService
 * @description Service for the room invite link
 */
export default class RoomInviteLinkService {

    /**
     * @function findOne
     * @description Find a room invite link by uuid
     * @param {string} uuid - The room uuid
     * @returns {Promise<RoomInviteLink>} room invite link
     * @throws {Error} if the uuid is invalid
     */
    static findOne = async (uuid: string): Promise<RoomInviteLink> => {
        if (!uuidValidate(uuid)) throw new Error('Invalid uuid');

        try {
            const response = await ApiService.builder()
                .endpoint(`/room_invite_link/${uuid}`)
                .method(BuilderMethods.GET)
                .auth()
                .execute() as RoomInviteLinkResponse;

            return response.data;
        } catch (error: unknown) {
            throw RoomInviteLinkService.handleError(error);
        }
    }

    /**
     * @function findAll
     * @description Find all room invite links for a room
     * @param {params} room_uuid - The room uuid
     * @param {params} page - The page number (optional)
     * @param {params} limit - The limit number (optional)
     * @returns {Promise<RoomInviteLink[]>} invite links
     * @throws {Error} if the room_uuid is invalid
     * @throws {Error} if the page is not a number
     * @throws {Error} if the limit is not a number
     */
    static findAll = async (room_uuid: string, page?: number, limit?: number): Promise<RoomInviteLink[]> => {
        if (!uuidValidate(room_uuid)) throw new Error('Invalid room_uuid');
        if (page && typeof page !== 'number') throw new Error('If provided, page must be a number');
        if (limit && typeof limit !== 'number') throw new Error('If provided, limit must be a number');

        try {
            const response = await ApiService.builder()
                .endpoint(`/room_invite_links`)
                .parameter('page', page)
                .parameter('limit', limit)
                .parameter('room_uuid', room_uuid)
                .method(BuilderMethods.GET)
                .auth()
                .execute() as RoomInviteLinksResponse;

            const { data } = response.data;
            return data;
        } catch (error: unknown) {
            throw RoomInviteLinkService.handleError(error);
        }
    }

    /**
     * @function create
     * @description Create a invite link
     * @param {RoomInviteLinkCreateInput} roomInviteLinkCreateInput - The invite link create input
     * @param {string} roomInviteLinkCreateInput.uuid - The invite link uuid
     * @param {string} roomInviteLinkCreateInput.room_uuid - The room uuid
     * @param {string} roomInviteLinkCreateInput.expires_at - The invite link expiration date (optional)
     * @returns {Promise<RoomInviteLink>} invite link
     * @throws {Error} if the uuid is invalid
     * @throws {Error} if the room_uuid is invalid
     * @throws {Error} if the expires_at is not a valid date
     */
    static create = async (roomInviteLinkCreateInput: RoomInviteLinkCreateInput): Promise<RoomInviteLink> => {
        if (!uuidValidate(roomInviteLinkCreateInput.uuid)) throw new Error('Invalid uuid');
        if (!uuidValidate(roomInviteLinkCreateInput.room_uuid)) throw new Error('Invalid room_uuid');
        if (roomInviteLinkCreateInput.expires_at && !Date.parse(roomInviteLinkCreateInput.expires_at)) throw new Error('expires_at must be a valid date');
        
        try {
            const response = await ApiService.builder()
                .endpoint(`/room_invite_link`)
                .method(BuilderMethods.POST)
                .body(roomInviteLinkCreateInput)
                .auth()
                .execute() as RoomInviteLinkResponse;

            return response.data;
        } catch (error: unknown) {
            throw RoomInviteLinkService.handleError(error);
        }
    }

    /**
     * @function update
     * @description Update a invite link
     * @param {string} uuid - The invite link uuid
     * @param {RoomInviteLinkUpdateInput} roomInviteLinkUpdateInput - The invite link update input
     * @param {string} roomInviteLinkUpdateInput.expires_at - The invite link expiration date (optional)
     * @returns {Promise<RoomInviteLink>} invite link
     * @throws {Error} if the uuid is invalid
     * @throws {Error} if the expires_at is not a valid date
     */
    static update = async (uuid: string, roomInviteLinkUpdateInput: RoomInviteLinkUpdateInput): Promise<RoomInviteLink> => {
        if (!uuidValidate(uuid)) throw new Error('Invalid uuid');
        if (roomInviteLinkUpdateInput.expires_at && !Date.parse(roomInviteLinkUpdateInput.expires_at)) throw new Error('expires_at must be a valid date');

        try {
            const response = await ApiService.builder()
                .endpoint(`/room_invite_link/${uuid}`)
                .method(BuilderMethods.PATCH)
                .body(roomInviteLinkUpdateInput)
                .auth()
                .execute() as RoomInviteLinkResponse;

            return response.data;
        } catch (error: unknown) {
            throw RoomInviteLinkService.handleError(error);
        }
    }

    /**
     * @function destroy
     * @description Destroy a invite link
     * @param {string} uuid - The invite link uuid
     * @returns {Promise<void>} void
     * @throws {Error} if the uuid is invalid
     */
    static destroy = async (uuid: string): Promise<void> => {
        if (!uuidValidate(uuid)) throw new Error('Invalid uuid');

        try {
            await ApiService.builder()
                .endpoint(`/room_invite_link/${uuid}`)
                .method(BuilderMethods.DELETE)
                .auth()
                .execute();
        } catch (error: unknown) {
            throw RoomInviteLinkService.handleError(error);
        }
    }

    /**
     * @function join
     * @description Join a room by invite link
     * @param {string} uuid - The invite link uuid
     * @returns {Promise<void>} void
     * @throws {Error} if the uuid is invalid
     */
    static join = async (uuid: string): Promise<void> => {
        if (!uuidValidate(uuid)) throw new Error('Invalid uuid');

        try {
            await ApiService.builder()
                .endpoint(`/room_invite_link/${uuid}/join`)
                .method(BuilderMethods.POST)
                .auth()
                .execute() as BuilderResponse;
        } catch (error: unknown) {
            throw RoomInviteLinkService.handleError(error);
        }
    }

    /**
     * @function handleError
     * @description Handle an error
     * @param {unknown} error - The error
     * @returns {Error} error
     */
    private static handleError = (error: unknown): Error => {
        if (error instanceof Error) {
            return new Error(error.message);
        } else {
            return new Error('An unknown error occurred');
        }
    }
}
