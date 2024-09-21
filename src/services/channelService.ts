import ApiService, { BuilderResponse, BuilderMethods } from "./apiService";
import Channel from "../models/channel";
import ChannelType from "../models/channel_type";

export default class ChannelService {
    /**
     * @function findOne
     * @description Find a channel by uuid
     * @param {string} uuid - The channel uuid
     * @returns {Promise<Channel>} channel
     */
    static findOne = async (uuid: string): Promise<Channel> => {
        try {
            const response = await ApiService.builder()
                .endpoint(`/channel/${uuid}`)
                .method(BuilderMethods.GET)
                .execute() as BuilderResponse;

            return response.data;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    /**
     * @function findAll
     * @description Find all channels for a room
     * @param {params} room_uuid - The room uuid
     * @param {params} page - The page number (optional)
     * @param {params} limit - The limit number (optional)
     * @returns {Promise<Channel[]>} channels
     */
    static findAll = async (room_uuid: string, page?: number, limit?: number): Promise<Channel[]> => {
        try {
            const response = await ApiService.builder()
                .endpoint(`/channels`)
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
     * @description Create a channel
     * @param {FormData} formData - The channel form data
     * @returns {Promise<Channel>} channel
     */
    static create = async (formData: FormData): Promise<Channel> => {
        try {
            const response = await ApiService.builder()
                .endpoint(`/channel`)
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
     * @description Update a channel
     * @param {string} uuid - The channel uuid
     * @param {FormData} formData - The channel form data
     * @returns {Promise<Channel>} channel
     */
    static update = async (uuid: string, formData: FormData): Promise<Channel> => {
        try {
            const response = await ApiService.builder()
                .endpoint(`/channel/${uuid}`)
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
     * @description Destroy a channel
     * @param {string} uuid - The channel uuid
     * @returns {Promise<string>} message
     */
    static destroy = async (uuid: string): Promise<string> => {
        try {
            const response = await ApiService.builder()
                .endpoint(`/channel/${uuid}`)
                .method(BuilderMethods.DELETE)
                .auth()
                .execute() as BuilderResponse;

            return response.data;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    /**
     * @function channelTypes
     * @description Find all channel types
     * @returns {Promise<ChannelType[]>} channel types
     */
    static channelTypes = async (): Promise<ChannelType[]> => {
        try {
            const response = await ApiService.builder()
                .endpoint(`/channel_types`)
                .method(BuilderMethods.GET)
                .execute() as BuilderResponse;

            const { data } = response.data;
            return data;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}
