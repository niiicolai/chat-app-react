import ApiService, { BuilderResponse, BuilderMethods } from "./apiService";
import { validate as uuidValidate } from 'uuid';
import RoomUser from "../models/room_user";

/**
 * @interface RoomUserResponse
 * @description The room user response
 * @param {RoomUser} data - The room user
 */
interface RoomUserResponse extends BuilderResponse {
    data: RoomUser;
}

/**
 * @interface RoomUsersResponse
 * @description The room users response
 * @param {RoomUser[]} data - room users
 */
interface RoomUsersResponse extends BuilderResponse {
    data: {
        data: RoomUser[];
        total: number;
    };
}

/**
 * @class RoomInviteLinkService
 * @description Service for the room invite link
 */
export default class RoomInviteLinkService {

    /**
     * @function findOne
     * @description Find a room user by uuid
     * @param {string} uuid - The room user uuid
     * @returns {Promise<RoomUser>} room user
     * @throws {Error} if the uuid is invalid
     */
    static findOne = async (uuid: string): Promise<RoomUser> => {
        if (!uuidValidate(uuid)) throw new Error('Invalid uuid');

        try {
            const response = await ApiService.builder()
                .endpoint(`/room_user/${uuid}`)
                .method(BuilderMethods.GET)
                .execute() as RoomUserResponse;

            return response.data;
        } catch (error: unknown) {
            throw RoomInviteLinkService.handleError(error);
        }
    }

    static findAuthenticatedUser = async (room_uuid: string): Promise<RoomUser> => {
        if (!uuidValidate(room_uuid)) throw new Error('Invalid room_uuid');

        try {
            const response = await ApiService.builder()
                .endpoint(`/room_user/me/${room_uuid}`)
                .method(BuilderMethods.GET)
                .auth()
                .execute() as RoomUserResponse;

            return response.data;
        } catch (error: unknown) {
            throw RoomInviteLinkService.handleError(error);
        }
    }

    /**
     * @function findAll
     * @description Find all room users for a room
     * @param {params} room_uuid - The room uuid
     * @param {params} page - The page number (optional)
     * @param {params} limit - The limit number (optional)
     * @returns {Promise<RoomUser[]>} room users
     */
    static findAll = async (room_uuid: string, page?: number, limit?: number): Promise<{ data: RoomUser[], total: number }> => {
        if (!uuidValidate(room_uuid)) throw new Error('Invalid room_uuid');
        if (page && typeof page !== 'number') throw new Error('If provided, page must be a number');
        if (limit && typeof limit !== 'number') throw new Error('If provided, limit must be a number');

        try {
            const response = await ApiService.builder()
                .endpoint(`/room_users`)
                .parameter('page', page)
                .parameter('limit', limit)
                .parameter('room_uuid', room_uuid)
                .method(BuilderMethods.GET)
                .auth()
                .execute() as RoomUsersResponse;

            return response.data;
        } catch (error: unknown) {
            throw RoomInviteLinkService.handleError(error);
        }
    }

    /**
     * @function update
     * @description Update a room user
     * @param {string} uuid - The room user uuid
     * @param {string} room_user_role_name - The room user role name
     * @returns {Promise<RoomUser>} room user
     * @throws {Error} if the uuid is invalid
     * @throws {Error} if the room_user_role_name is missing
     */
    static update = async (uuid: string, room_user_role_name: string): Promise<RoomUser> => {
        if (!uuidValidate(uuid)) throw new Error('Invalid uuid');
        if (!room_user_role_name) throw new Error('Missing room_user_role_name');

        try {
            const response = await ApiService.builder()
                .endpoint(`/room_user/${uuid}`)
                .method(BuilderMethods.PATCH)
                .body({ room_user_role_name })
                .auth()
                .execute() as RoomUserResponse;

            return response.data;
        } catch (error: unknown) {
            throw RoomInviteLinkService.handleError(error);
        }
    }

    /**
     * @function destroy
     * @description Destroy a room user
     * @param {string} uuid - The room user uuid
     * @returns {Promise<void>} void
     * @throws {Error} if the uuid is invalid
     */
    static destroy = async (uuid: string): Promise<void> => {
        if (!uuidValidate(uuid)) throw new Error('Invalid uuid');

        try {
            await ApiService.builder()
                .endpoint(`/room_user/${uuid}`)
                .method(BuilderMethods.DELETE)
                .auth()
                .execute();
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
