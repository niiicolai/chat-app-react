import ApiService, { BuilderResponse, BuilderMethods } from "./apiService";
import ChannelWebhook from "../models/channel_webhook";

export default class ChannelWebhookService {
    /**
     * @function findOne
     * @description Find a channel webhook by uuid
     * @param {string} uuid - The channel webhook uuid
     * @returns {Promise<ChannelWebhook>} channel webhook
     */
    static findOne = async (uuid: string): Promise<ChannelWebhook> => {
        try {
            const response = await ApiService.builder()
                .endpoint(`/channel_webhook/${uuid}`)
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
     * @description Find all channel webhooks for a room
     * @param {params} room_uuid - The room uuid
     * @param {params} page - The page number (optional)
     * @param {params} limit - The limit number (optional)
     * @returns {Promise<ChannelWebhook[]>} channel webhook
     */
    static findAll = async (room_uuid: string, page?: number, limit?: number): Promise<ChannelWebhook[]> => {
        try {
            const response = await ApiService.builder()
                .endpoint(`/channel_webhooks`)
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
     * @description Create a channel webhook
     * @param {FormData} formData - The channel webhook form data
     * @returns {Promise<ChannelWebhook>} channel webhook
     */
    static create = async (formData: FormData): Promise<ChannelWebhook> => {
        try {
            const response = await ApiService.builder()
                .endpoint(`/channel_webhook`)
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
     * @description Update a channel webhook
     * @param {string} uuid - The channel webhook uuid
     * @param {FormData} formData - The channel webhook form data
     * @returns {Promise<ChannelWebhook>} channel webhook
     */
    static update = async (uuid: string, formData: FormData): Promise<ChannelWebhook> => {
        try {
            const response = await ApiService.builder()
                .endpoint(`/channel_webhook/${uuid}`)
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
     * @description Destroy a channel webhook
     * @param {string} uuid - The channel webhook uuid
     * @returns {Promise<string>} message
     */
    static destroy = async (uuid: string): Promise<string> => {
        try {
            const response = await ApiService.builder()
                .endpoint(`/channel_webhook/${uuid}`)
                .method(BuilderMethods.DELETE)
                .auth()
                .execute() as BuilderResponse;

            return response.data;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    /**
     * @function test
     * @description Test a channel webhook
     * @param {string} uuid - The channel webhook uuid
     * @param {FormData} formData - The channel webhook form data
     * @returns {Promise<string>} message
     */
    static test = async (uuid: string, obj: any): Promise<string> => {
        try {
            const response = await ApiService.builder()
                .endpoint(`/channel_webhook/${uuid}`)
                .method(BuilderMethods.POST)
                .body(obj)
                .auth()
                .execute() as BuilderResponse;

            return response.data;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}
