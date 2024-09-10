import ApiService, { BuilderResponse, BuilderMethods } from "./apiService.js";

/**
 * @interface Room
 * @description Room interface
 * @param {string} uuid - The room uuid
 * @param {string} name - The room name
 * @param {string} description - The room description
 * @param {string} room_category_name - The room category name
 * @param {string} avatar_src - The room avatar source
 * @param {string} created_at - The room created at
 * @param {string} updated_at - The room updated at
 */
export interface Room {
    uuid: string;
    name: string;
    description: string;
    room_category_name: string;
    avatar_src: string;
    created_at: string;
    updated_at: string;
}

/**
 * @interface RoomCategory
 * @description Room category interface
 * @param {string} name - The room category name
 * @param {string} created_at - The room category created at
 * @param {string} updated_at - The room category updated at
 */
export interface RoomCategory {
    name: string;
    created_at: string;
    updated_at: string;
}

export default class RoomService {
    /**
     * @function findOne
     * @description Find a room by uuid
     * @param {string} uuid - The room uuid
     * @returns {Promise<Room>} room
     */
    static findOne = async (uuid: string): Promise<Room> => {
        try {
            const response = await ApiService.builder()
                .endpoint(`/room/${uuid}`)
                .method(BuilderMethods.GET)
                .execute() as BuilderResponse;

            return response.data;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    /**
     * @function findAll
     * @description Find all rooms
     * @param {params} page - The page number (optional)
     * @param {params} limit - The limit number (optional)
     * @returns {Promise<Room[]>} rooms
     */
    static findAll = async (page?: number, limit?: number): Promise<Room[]> => {
        try {
            const response = await ApiService.builder()
                .endpoint(`/rooms`)
                .parameter('page', page)
                .parameter('limit', limit)
                .method(BuilderMethods.GET)
                .auth()
                .execute() as BuilderResponse;

            const { data } = response.data;
            return data;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    /**
     * @function create
     * @description Create a room
     * @param {FormData} formData - The room form data
     * @returns {Promise<Room>} room
     */
    static create = async (formData: FormData): Promise<Room> => {
        try {
            const response = await ApiService.builder()
                .endpoint(`/room`)
                .method(BuilderMethods.POST)
                .body(formData)
                .auth()
                .execute() as BuilderResponse;

            return response.data;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    /**
     * @function update
     * @description Update a room
     * @param {string} uuid - The room uuid
     * @param {FormData} formData - The room form data
     * @returns {Promise<Room>} room
     */
    static update = async (uuid: string, formData: FormData): Promise<Room> => {
        try {
            const response = await ApiService.builder()
                .endpoint(`/room/${uuid}`)
                .method(BuilderMethods.PATCH)
                .body(formData)
                .auth()
                .execute() as BuilderResponse;

            return response.data;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    /**
     * @function destroy
     * @description Destroy a room
     * @param {string} uuid - The room uuid
     * @returns {Promise<string>} message
     */
    static destroy = async (uuid: string): Promise<string> => {
        try {
            const response = await ApiService.builder()
                .endpoint(`/room/${uuid}`)
                .method(BuilderMethods.DELETE)
                .auth()
                .execute() as BuilderResponse;

            return response.data;
        } catch (error: any) {
            throw new Error(error.message);
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
                .execute() as BuilderResponse;

            const { data } = response.data;
            return data;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}
