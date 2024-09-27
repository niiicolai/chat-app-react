import ApiService, { BuilderResponse, BuilderMethods } from "./apiService";
import { validate as uuidValidate } from 'uuid';
import RoomFile from "../models/room_file";

/**
 * @interface RoomFileResponse
 * @description The room file response
 * @param {RoomFile} data - The room file
 */
interface RoomFileResponse extends BuilderResponse {
    data: RoomFile;
}

/**
 * @interface RoomFilesResponse
 * @description The room files response
 * @param {RoomFile[]} data - room files
 */
interface RoomFilesResponse extends BuilderResponse {
    data: {
        data: RoomFile[];
    };
}

/**
 * @class RoomFileService
 * @description Service for the room file
 */
export default class RoomFileService {

    /**
     * @function findOne
     * @description Find a room file by uuid
     * @param {string} uuid - The room file uuid
     * @returns {Promise<RoomFile>} room file
     * @throws {Error} if the uuid is invalid
     */
    static findOne = async (uuid: string): Promise<RoomFile> => {
        if (!uuidValidate(uuid)) throw new Error('Invalid uuid');

        try {
            const response = await ApiService.builder()
                .endpoint(`/room_file/${uuid}`)
                .method(BuilderMethods.GET)
                .auth()
                .execute() as RoomFileResponse;

            return response.data;
        } catch (error: unknown) {
            throw RoomFileService.handleError(error);
        }
    }

    /**
     * @function findAll
     * @description Find all room files for a room
     * @param {params} room_uuid - The room uuid
     * @param {params} page - The page number (optional)
     * @param {params} limit - The limit number (optional)
     * @returns {Promise<RoomFile[]>} room files
     * @throws {Error} if the room_uuid is invalid
     * @throws {Error} if the page is not a number
     * @throws {Error} if the limit is not a number
     */
    static findAll = async (room_uuid: string, page?: number, limit?: number): Promise<RoomFile[]> => {
        if (!uuidValidate(room_uuid)) throw new Error('Invalid room_uuid');
        if (page && typeof page !== 'number') throw new Error('If provided, page must be a number');
        if (limit && typeof limit !== 'number') throw new Error('If provided, limit must be a number');

        try {
            const response = await ApiService.builder()
                .endpoint(`/room_files`)
                .parameter('page', page)
                .parameter('limit', limit)
                .parameter('room_uuid', room_uuid)
                .method(BuilderMethods.GET)
                .auth()
                .execute() as RoomFilesResponse;

            const { data } = response.data;
            return data;
        } catch (error: unknown) {
            throw RoomFileService.handleError(error);
        }
    }

    /**
     * @function destroy
     * @description Destroy a room file
     * @param {string} uuid - The room file uuid
     * @returns {Promise<void>} void
     * @throws {Error} if the uuid is invalid
     */
    static destroy = async (uuid: string): Promise<void> => {
        if (!uuidValidate(uuid)) throw new Error('Invalid uuid');

        try {
            await ApiService.builder()
                .endpoint(`/room_file/${uuid}`)
                .method(BuilderMethods.DELETE)
                .auth()
                .execute();
        } catch (error: unknown) {
            throw RoomFileService.handleError(error);
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
