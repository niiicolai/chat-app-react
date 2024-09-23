import ApiService, { BuilderResponse, BuilderMethods } from "./apiService";
import ChannelMessage from "../models/channel_message";
import ChannelMessageType from "../models/channel_message_type";

export default class ChannelService {
    /**
     * @function findOne
     * @description Find a channel message by uuid
     * @param {string} uuid - The channel message uuid
     * @returns {Promise<ChannelMessage>} channel message
     */
    static findOne = async (uuid: string): Promise<ChannelMessage> => {
        try {
            const response = await ApiService.builder()
                .endpoint(`/channel_message/${uuid}`)
                .method(BuilderMethods.GET)
                .execute() as BuilderResponse;

            return response.data;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    /**
     * @function findAll
     * @description Find all channel message for a channel
     * @param {params} channel_uuid - The channel uuid
     * @param {params} page - The page number (optional)
     * @param {params} limit - The limit number (optional)
     * @returns {Promise<ChannelMessage[]>} channels
     */
    static findAll = async (channel_uuid: string, page?: number, limit?: number): Promise<ChannelMessage[]> => {
        try {
            const response = await ApiService.builder()
                .endpoint(`/channel_messages`)
                .parameter('page', page)
                .parameter('limit', limit)
                .parameter('channel_uuid', channel_uuid)
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
     * @description Create a channel message
     * @param {FormData} formData - The channel message form data
     * @returns {Promise<ChannelMessage>} channel message
     */
    static create = async (formData: FormData): Promise<ChannelMessage> => {
        try {
            const response = await ApiService.builder()
                .endpoint(`/channel_message`)
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
     * @description Update a channel message
     * @param {string} uuid - The channel message uuid
     * @param {any} obj - The channel message object
     * @returns {Promise<ChannelMessage>} channel message
     */
    static update = async (uuid: string, obj: any): Promise<ChannelMessage> => {
        try {
            const response = await ApiService.builder()
                .endpoint(`/channel_message/${uuid}`)
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
     * @description Destroy a channel message
     * @param {string} uuid - The channel message uuid
     * @returns {Promise<string>} message
     */
    static destroy = async (uuid: string): Promise<string> => {
        try {
            const response = await ApiService.builder()
                .endpoint(`/channel_message/${uuid}`)
                .method(BuilderMethods.DELETE)
                .auth()
                .execute() as BuilderResponse;

            return response.data;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    /**
     * @function channelMessageTypes
     * @description Find all channel message types
     * @returns {Promise<ChannelMessageType[]>} channel message types
     */
    static channelMessageTypes = async (): Promise<ChannelMessageType[]> => {
        try {
            const response = await ApiService.builder()
                .endpoint(`/channel_message_types`)
                .method(BuilderMethods.GET)
                .execute() as BuilderResponse;

            const { data } = response.data;
            return data;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}
