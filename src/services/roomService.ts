import ApiService, { BuilderResponse, BuilderMethods } from "./apiService";
import Room from "../models/room";
import RoomCategory from "../models/room_category";

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
                .auth()
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

    /**
     * @function updateSettings
     * @description Update a room settings
     * @param {string} uuid - The room uuid
     * @param {any} settings - The room settings
     * @returns {Promise<Room>} room
     */
    static updateSettings = async (uuid: string | undefined, settings: any) => {
        if (!uuid) return;
        try {
            const response = await ApiService.builder()
                .endpoint(`/room/${uuid}/settings`)
                .method(BuilderMethods.PATCH)
                .body(settings)
                .auth()
                .execute() as BuilderResponse;

            return response.data;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    /**
     * @function leave
     * @description leave a room
     * @param {string} uuid - The room uuid
     * @returns {Promise<Room>} room
     */
    static leave = async (uuid: string | undefined) => {
        if (!uuid) return;
        try {
            const response = await ApiService.builder()
                .endpoint(`/room/${uuid}/leave`)
                .method(BuilderMethods.DELETE)
                .auth()
                .execute() as BuilderResponse;

            return response.data;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}
