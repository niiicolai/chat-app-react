import ApiService, { BuilderResponse, BuilderMethods } from "./apiService";
import { validate as uuidValidate } from 'uuid';
import ChannelWebhook from "../models/channel_webhook";

/**
 * @interface ChannelWebhookResponse
 * @description The channel webhook response
 * @param {ChannelWebhook} data - The channel webhook
 */
interface ChannelWebhookResponse extends BuilderResponse {
    data: ChannelWebhook;
}

/**
 * @interface ChannelWebhooksResponse
 * @description The channel webhooks response
 * @param {ChannelWebhook[]} data - The channel webhooks
 */
interface ChannelWebhooksResponse extends BuilderResponse {
    data: {
        data: ChannelWebhook[];
        total: number;
        pages: number;
    };
}

/**
 * @interface MessageInput
 * @description The message input for testing a channel webhook
 * @param {string} message - The message
 */
export interface MessageInput {
    message: string;
}

/**
 * @class ChannelWebhookService
 * @description Service for the channel webhook
 */
export default class ChannelWebhookService {

    /**
     * @function findOne
     * @description Find a channel webhook by uuid
     * @param {string} uuid - The channel webhook uuid
     * @returns {Promise<ChannelWebhook>} channel webhook
     * @throws {Error} if the uuid is invalid
     */
    static findOne = async (uuid: string): Promise<ChannelWebhook> => {
        if (!uuidValidate(uuid)) throw new Error('Invalid uuid');

        try {
            const response = await ApiService.builder()
                .endpoint(`/channel_webhook/${uuid}`)
                .method(BuilderMethods.GET)
                .auth()
                .execute() as ChannelWebhookResponse;

            return response.data;
        } catch (error: unknown) {
            throw ChannelWebhookService.handleError(error);
        }
    }

    /**
     * @function findAll
     * @description Find all channel webhooks for a room
     * @param {params} room_uuid - The room uuid
     * @param {params} page - The page number (optional)
     * @param {params} limit - The limit number (optional)
     * @returns {Promise<ChannelWebhook[]>} channel webhook
     * @throws {Error} if the room_uuid is invalid
     * @throws {Error} if the page is not a number
     * @throws {Error} if the limit is not a number
     */
    static findAll = async (room_uuid: string, page?: number, limit?: number): Promise<{ data: ChannelWebhook[], total: number, pages: number }> => {
        if (!uuidValidate(room_uuid)) throw new Error('Invalid room_uuid');
        if (page && typeof page !== 'number') throw new Error('If provided, page must be a number');
        if (limit && typeof limit !== 'number') throw new Error('If provided, limit must be a number');

        try {
            const response = await ApiService.builder()
                .endpoint(`/channel_webhooks`)
                .parameter('page', page)
                .parameter('limit', limit)
                .parameter('room_uuid', room_uuid)
                .method(BuilderMethods.GET)
                .auth()
                .execute() as ChannelWebhooksResponse;

            return response.data;
        } catch (error: unknown) {
            throw ChannelWebhookService.handleError(error);
        }
    }

    /**
     * @function create
     * @description Create a channel webhook
     * @param {FormData} formData - The channel webhook form data
     * @param {string} formData.uuid - The channel webhook uuid
     * @param {string} formData.channel_uuid - The channel uuid
     * @param {string} formData.name - The channel webhook name
     * @param {string} formData.description - The channel webhook description
     * @param {string} formData.file - The channel webhook avatar file (optional)
     * @returns {Promise<ChannelWebhook>} channel webhook
     * @throws {Error} if the uuid is invalid
     * @throws {Error} if the channel_uuid is invalid
     * @throws {Error} if the name is invalid
     * @throws {Error} if the description is invalid
     */
    static create = async (formData: FormData): Promise<ChannelWebhook> => {
        if (!uuidValidate(formData.get('uuid') as string)) throw new Error('Invalid uuid');
        if (!uuidValidate(formData.get('channel_uuid') as string)) throw new Error('Invalid channel_uuid');
        if (!formData.get('name')) throw new Error('Invalid name');
        if (!formData.get('description')) throw new Error('Invalid description');

        try {
            const response = await ApiService.builder()
                .endpoint(`/channel_webhook`)
                .method(BuilderMethods.POST)
                .body(formData)
                .auth()
                .execute() as ChannelWebhookResponse;

            return response.data;
        } catch (error: unknown) {
            throw ChannelWebhookService.handleError(error);
        }
    }

    /**
     * @function update
     * @description Update a channel webhook
     * @param {string} uuid - The channel webhook uuid
     * @param {FormData} formData - The channel webhook form data
     * @param {string} formData.name - The channel webhook name (optional)
     * @param {string} formData.description - The channel webhook description (optional)
     * @param {string} formData.file - The channel webhook avatar file (optional)
     * @returns {Promise<ChannelWebhook>} channel webhook
     * @throws {Error} if the uuid is invalid
     * @throws {Error} if the name is not a string
     * @throws {Error} if the description is not a string
     */
    static update = async (uuid: string, formData: FormData): Promise<ChannelWebhook> => {
        if (!uuidValidate(uuid)) throw new Error('Invalid uuid');
        if (formData.get('name') && typeof formData.get('name') !== 'string') throw new Error('name must be a string');
        if (formData.get('description') && typeof formData.get('description') !== 'string') throw new Error('description must be a string');

        try {
            const response = await ApiService.builder()
                .endpoint(`/channel_webhook/${uuid}`)
                .method(BuilderMethods.PATCH)
                .body(formData)
                .auth()
                .execute() as ChannelWebhookResponse;

            return response.data;
        } catch (error: unknown) {
            throw ChannelWebhookService.handleError(error);
        }
    }

    /**
     * @function destroy
     * @description Destroy a channel webhook
     * @param {string} uuid - The channel webhook uuid
     * @returns {Promise<void>} void
     * @throws {Error} if the uuid is invalid
     */
    static destroy = async (uuid: string): Promise<void> => {
        if (!uuidValidate(uuid)) throw new Error('Invalid uuid');

        try {
            await ApiService.builder()
                .endpoint(`/channel_webhook/${uuid}`)
                .method(BuilderMethods.DELETE)
                .auth()
                .execute();
        } catch (error: unknown) {
            throw ChannelWebhookService.handleError(error);
        }
    }

    /**
     * @function test
     * @description Test a channel webhook
     * @param {string} uuid - The channel webhook uuid
     * @param {MessageInput} messageInput - The message input
     * @param {string} messageInput.message - The message
     * @returns {Promise<void>} void
     */
    static test = async (uuid: string, messageInput: MessageInput): Promise<void> => {
        if (!uuidValidate(uuid)) throw new Error('Invalid uuid');
        if (!messageInput.message) throw new Error('messageInput.message is required');

        try {
            await ApiService.builder()
                .endpoint(`/channel_webhook/${uuid}`)
                .method(BuilderMethods.POST)
                .body(messageInput)
                .auth()
                .execute();
        } catch (error: unknown) {
            throw ChannelWebhookService.handleError(error);
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
