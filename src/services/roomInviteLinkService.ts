import ApiService, { BuilderResponse, BuilderMethods } from "./apiService";
import RoomInviteLink from "../models/room_invite_link";

export default class RoomInviteLinkService {
    /**
     * @function findOne
     * @description Find a room invite link by uuid
     * @param {string} uuid - The room uuid
     * @returns {Promise<RoomInviteLink>} room invite link
     */
    static findOne = async (uuid: string): Promise<RoomInviteLink> => {
        try {
            const response = await ApiService.builder()
                .endpoint(`/room_invite_link/${uuid}`)
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
     * @description Find all room invite links for a room
     * @param {params} room_uuid - The room uuid
     * @param {params} page - The page number (optional)
     * @param {params} limit - The limit number (optional)
     * @returns {Promise<RoomInviteLink[]>} invite links
     */
    static findAll = async (room_uuid: string, page?: number, limit?: number): Promise<RoomInviteLink[]> => {
        try {
            const response = await ApiService.builder()
                .endpoint(`/room_invite_links`)
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
     * @function create
     * @description Create a invite link
     * @param {FormData} formData - The invite link form data
     * @returns {Promise<RoomInviteLink>} invite link
     */
    static create = async (obj: any): Promise<RoomInviteLink> => {
        try {
            const response = await ApiService.builder()
                .endpoint(`/room_invite_link`)
                .method(BuilderMethods.POST)
                .body(obj)
                .auth()
                .execute() as BuilderResponse;

            return response.data;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    /**
     * @function update
     * @description Update a invite link
     * @param {string} uuid - The invite link uuid
     * @param {FormData} formData - The invite link form data
     * @returns {Promise<RoomInviteLink>} invite link
     */
    static update = async (uuid: string, obj: any): Promise<RoomInviteLink> => {
        try {
            const response = await ApiService.builder()
                .endpoint(`/room_invite_link/${uuid}`)
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
     * @description Destroy a invite link
     * @param {string} uuid - The invite link uuid
     * @returns {Promise<string>} message
     */
    static destroy = async (uuid: string): Promise<string> => {
        try {
            const response = await ApiService.builder()
                .endpoint(`/room_invite_link/${uuid}`)
                .method(BuilderMethods.DELETE)
                .auth()
                .execute() as BuilderResponse;

            return response.data;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    /**
     * @function join
     * @description Join a room by invite link
     * @param {string} uuid - The invite link uuid
     * @returns {Promise<string>} message
     */
    static join = async (uuid: string): Promise<string> => {
        try {
            const response = await ApiService.builder()
                .endpoint(`/room_invite_link/${uuid}/join`)
                .method(BuilderMethods.POST)
                .auth()
                .execute() as BuilderResponse;

            return response.data;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}
