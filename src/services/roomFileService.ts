import ApiService, { BuilderResponse, BuilderMethods } from "./apiService";
import RoomFile from "../models/room_file";

export default class RoomInviteLinkService {
    /**
     * @function findOne
     * @description Find a room file by uuid
     * @param {string} uuid - The room file uuid
     * @returns {Promise<RoomFile>} room file
     */
    static findOne = async (uuid: string): Promise<RoomFile> => {
        try {
            const response = await ApiService.builder()
                .endpoint(`/room_file/${uuid}`)
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
     * @description Find all room files for a room
     * @param {params} room_uuid - The room uuid
     * @param {params} page - The page number (optional)
     * @param {params} limit - The limit number (optional)
     * @returns {Promise<RoomFile[]>} room files
     */
    static findAll = async (room_uuid: string, page?: number, limit?: number): Promise<RoomFile[]> => {
        try {
            const response = await ApiService.builder()
                .endpoint(`/room_files`)
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
     * @function destroy
     * @description Destroy a room file
     * @param {string} uuid - The room file uuid
     * @returns {Promise<string>} message
     */
    static destroy = async (uuid: string): Promise<string> => {
        try {
            const response = await ApiService.builder()
                .endpoint(`/room_file/${uuid}`)
                .method(BuilderMethods.DELETE)
                .auth()
                .execute() as BuilderResponse;

            return response.data;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}
