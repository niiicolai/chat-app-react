import ApiService, { BuilderResponse, BuilderMethods } from "./apiService";
import { validate as uuidValidate } from 'uuid';
import Room from "../models/room";
import RoomCategory from "../models/room_category";

/**
 * @interface RoomResponse
 * @description The room response
 * @param {Room} data - The room 
 */
interface RoomResponse extends BuilderResponse {
    data: Room;
}

/**
 * @interface RoomsResponse
 * @description The rooms response
 * @param {Room[]} data - rooms
 */
interface RoomsResponse extends BuilderResponse {
    data: {
        data: Room[];
    };
}

/**
 * @interface RoomCategoriesResponse
 * @description The room categories response
 * @param {RoomCategory[]} data - room categories
 */
interface RoomCategoriesResponse extends BuilderResponse {
    data: {
        data: RoomCategory[];
    };
}

/**
 * @interface SettingsInput
 * @description The settings input
 * @param {string} join_channel_uuid - The join channel uuid
 * @param {string} join_message - The join message
 * @param {string} rules_text - The rules text
 */
export interface SettingsInput {
    join_channel_uuid: string;
    join_message: string;
    rules_text: string;
}

/**
 * @class RoomService
 * @description Service for the room
 */
export default class RoomService {
    /**
     * @function findOne
     * @description Find a room by uuid
     * @param {string} uuid - The room uuid
     * @returns {Promise<Room>} room
     * @throws {Error} if the uuid is invalid
     */
    static findOne = async (uuid: string): Promise<Room> => {
        if (!uuidValidate(uuid)) throw new Error('Invalid uuid');

        try {
            const response = await ApiService.builder()
                .endpoint(`/room/${uuid}`)
                .method(BuilderMethods.GET)
                .auth()
                .execute() as RoomResponse;

            return response.data;
        } catch (error: unknown) {
            throw RoomService.handleError(error);
        }
    }

    /**
     * @function findAll
     * @description Find all rooms
     * @param {params} page - The page number (optional)
     * @param {params} limit - The limit number (optional)
     * @returns {Promise<Room[]>} rooms
     * @throws {Error} if the page is not a number
     * @throws {Error} if the limit is not a number
     */
    static findAll = async (page?: number, limit?: number): Promise<Room[]> => {
        if (page && typeof page !== 'number') throw new Error('If provided, page must be a number');
        if (limit && typeof limit !== 'number') throw new Error('If provided, limit must be a number');

        try {
            const response = await ApiService.builder()
                .endpoint(`/rooms`)
                .parameter('page', page)
                .parameter('limit', limit)
                .method(BuilderMethods.GET)
                .auth()
                .execute() as RoomsResponse;

            const { data } = response.data;
            return data;
        } catch (error: unknown) {
            throw RoomService.handleError(error);
        }
    }

    /**
     * @function create
     * @description Create a room
     * @param {FormData} formData - The room form data
     * @param {string} formData.uuid - The room uuid
     * @param {string} formData.name - The room name
     * @param {string} formData.description - The room description
     * @param {string} formData.room_category_name - The room category name
     * @returns {Promise<Room>} room
     * @throws {Error} if the form data's uuid is invalid
     * @throws {Error} if the form data's name is missing
     * @throws {Error} if the form data's description is missing
     * @throws {Error} if the form data's room_category_name is missing
     */
    static create = async (formData: FormData): Promise<Room> => {
        if (!uuidValidate(formData.get('uuid') as string)) throw new Error('Invalid uuid');
        if (!formData.get('name')) throw new Error('Name is required');
        if (!formData.get('description')) throw new Error('Description is required');
        if (!formData.get('room_category_name')) throw new Error('Room category name is required');

        try {
            const response = await ApiService.builder()
                .endpoint(`/room`)
                .method(BuilderMethods.POST)
                .body(formData)
                .auth()
                .execute() as RoomResponse;

            return response.data;
        } catch (error: unknown) {
            throw RoomService.handleError(error);
        }
    }

    /**
     * @function update
     * @description Update a room
     * @param {string} uuid - The room uuid
     * @param {FormData} formData - The room form data
     * @param {string} formData.name - The room name (optional)
     * @param {string} formData.description - The room description (optional)
     * @param {string} formData.room_category_name - The room category name (optional)
     * @returns {Promise<Room>} room
     */
    static update = async (uuid: string, formData: FormData): Promise<Room> => {
        if (!uuidValidate(uuid)) throw new Error('Invalid uuid');
        if (formData.get('name') && typeof formData.get('name') !== 'string') throw new Error('Name must be a string');
        if (formData.get('description') && typeof formData.get('description') !== 'string') throw new Error('Description must be a string');
        if (formData.get('room_category_name') && typeof formData.get('room_category_name') !== 'string') throw new Error('Room category name must be a string');

        try {
            const response = await ApiService.builder()
                .endpoint(`/room/${uuid}`)
                .method(BuilderMethods.PATCH)
                .body(formData)
                .auth()
                .execute() as RoomResponse;

            return response.data;
        } catch (error: unknown) {
            throw RoomService.handleError(error);
        }
    }

    /**
     * @function destroy
     * @description Destroy a room
     * @param {string} uuid - The room uuid
     * @returns {Promise<void>} void
     * @throws {Error} if the uuid is invalid
     */
    static destroy = async (uuid: string): Promise<void> => {
        if (!uuidValidate(uuid)) throw new Error('Invalid uuid');

        try {
            await ApiService.builder()
                .endpoint(`/room/${uuid}`)
                .method(BuilderMethods.DELETE)
                .auth()
                .execute();
        } catch (error: unknown) {
            throw RoomService.handleError(error);
        }
    }

    /**
     * @function roomCategories
     * @description Find all room categories
     * @returns {Promise<RoomCategory[]>} room categories
     */
    static roomCategories = async (): Promise<RoomCategory[]> => {
        try {
            const response = await ApiService.builder()
                .endpoint(`/room_categories`)
                .method(BuilderMethods.GET)
                .auth()
                .execute() as RoomCategoriesResponse;

            const { data } = response.data;
            return data;
        } catch (error: unknown) {
            throw RoomService.handleError(error);
        }
    }

    /**
     * @function updateSettings
     * @description Update a room settings
     * @param {string} uuid - The room uuid
     * @param {SettingsInput} settings - The room settings
     * @returns {Promise<void>} void
     * @throws {Error} if the uuid is invalid
     */
    static updateSettings = async (uuid: string, settings: SettingsInput): Promise<void> => {
        if (!uuidValidate(uuid)) throw new Error('Invalid uuid');

        try {
            await ApiService.builder()
                .endpoint(`/room/${uuid}/settings`)
                .method(BuilderMethods.PATCH)
                .body(settings)
                .auth()
                .execute();
        } catch (error: unknown) {
            throw RoomService.handleError(error);
        }
    }

    /**
     * @function leave
     * @description leave a room
     * @param {string} uuid - The room uuid
     * @returns {Promise<void>} void
     * @throws {Error} if the uuid is invalid
     */
    static leave = async (uuid: string): Promise<void> => {
        if (!uuidValidate(uuid)) throw new Error('Invalid uuid');
        
        try {
            await ApiService.builder()
                .endpoint(`/room/${uuid}/leave`)
                .method(BuilderMethods.DELETE)
                .auth()
                .execute();
        } catch (error: unknown) {
            throw RoomService.handleError(error);
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
