import ApiService, { BuilderResponse, BuilderMethods } from "./apiService";
import RoomUser from "../models/room_user";

export default class RoomInviteLinkService {

    /**
     * @function findOne
     * @description Find a room user by uuid
     * @param {string} uuid - The room user uuid
     * @returns {Promise<RoomUser>} room user
     */
    static findOne = async (uuid: string): Promise<RoomUser> => {
        try {
            const response = await ApiService.builder()
                .endpoint(`/room_user/${uuid}`)
                .method(BuilderMethods.GET)
                .execute() as BuilderResponse;

            return response.data;
        } catch (error: any) {
            throw new Error(error.message);
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
    static findAll = async (room_uuid: string, page?: number, limit?: number): Promise<RoomUser[]> => {
        try {
            const response = await ApiService.builder()
                .endpoint(`/room_users`)
                .parameter('page', page)
                .parameter('limit', limit)
                .parameter('room_uuid', room_uuid)
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
     * @function update
     * @description Update a room user
     * @param {string} uuid - The room user uuid
     * @param {FormData} formData - The room user form data
     * @returns {Promise<RoomUser>} room user
     */
    static update = async (uuid: string, obj: any): Promise<RoomUser> => {
        try {
            const response = await ApiService.builder()
                .endpoint(`/room_user/${uuid}`)
                .method(BuilderMethods.PATCH)
                .body(obj)
                .auth()
                .execute() as BuilderResponse;

            return response.data;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    /**
     * @function destroy
     * @description Destroy a room user
     * @param {string} uuid - The room user uuid
     * @returns {Promise<string>} message
     */
    static destroy = async (uuid: string): Promise<string> => {
        try {
            const response = await ApiService.builder()
                .endpoint(`/room_user/${uuid}`)
                .method(BuilderMethods.DELETE)
                .auth()
                .execute() as BuilderResponse;

            return response.data;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}
