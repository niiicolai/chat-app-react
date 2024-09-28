import ApiService, { BuilderResponse, BuilderMethods } from "./apiService";
import { validate as uuidValidate } from 'uuid';
import ChannelMessage from "../models/channel_message";
import ChannelMessageType from "../models/channel_message_type";

/**
 * @interface ChannelMessageResponse
 * @description The channel message response
 * @param {ChannelMessage} data - The channel message
 */
interface ChannelMessageResponse extends BuilderResponse {
    data: ChannelMessage;
}

/**
 * @interface ChannelMessagesResponse
 * @description The channel messages response
 * @param {ChannelMessage[]} data - The channel messages
 */
interface ChannelMessagesResponse extends BuilderResponse {
    data: {
        data: ChannelMessage[];
    };
}

/**
 * @interface ChannelMessageTypesResponse
 * @description The channel message types response
 * @param {ChannelMessageType[]} data - The channel message types
 */
interface ChannelMessageTypesResponse extends BuilderResponse {
    data: {
        data: ChannelMessageType[];
    };
}

/**
 * @interface ChannelMessageUpdateInput
 * @description The channel message update input
 * @param {string} body - The channel message body
 */
export interface ChannelMessageUpdateInput {
    body: string;
}

/**
 * @class ChannelMessageService
 * @description Service for the channel message
 */
export default class ChannelMessageService {

    /**
     * @function findOne
     * @description Find a channel message by uuid
     * @param {string} uuid - The channel message uuid
     * @returns {Promise<ChannelMessage>} channel message
     * @throws {Error} if the uuid is invalid
     */
    static findOne = async (uuid: string): Promise<ChannelMessage> => {
        if (!uuidValidate(uuid)) throw new Error('Invalid uuid');

        try {
            const response = await ApiService.builder()
                .endpoint(`/channel_message/${uuid}`)
                .method(BuilderMethods.GET)
                .execute() as ChannelMessageResponse;

            return response.data;
        } catch (error: unknown) {
            throw ChannelMessageService.handleError(error);
        }
    }

    /**
     * @function findAll
     * @description Find all channel message for a channel
     * @param {params} channel_uuid - The channel uuid
     * @param {params} page - The page number (optional)
     * @param {params} limit - The limit number (optional)
     * @returns {Promise<ChannelMessage[]>} channels
     * @throws {Error} if the channel_uuid is invalid
     * @throws {Error} if the page is not a number
     * @throws {Error} if the limit is not a number
     */
    static findAll = async (channel_uuid: string, page?: number, limit?: number): Promise<ChannelMessage[]> => {
        if (!uuidValidate(channel_uuid)) throw new Error('Invalid channel_uuid');
        if (page && typeof page !== 'number') throw new Error('If provided, page must be a number');
        if (limit && typeof limit !== 'number') throw new Error('If provided, limit must be a number');
        
        try {
            const response = await ApiService.builder()
                .endpoint(`/channel_messages`)
                .parameter('page', page)
                .parameter('limit', limit)
                .parameter('channel_uuid', channel_uuid)
                .method(BuilderMethods.GET)
                .auth()
                .execute() as ChannelMessagesResponse;

            const { data } = response.data;
            return data;
        } catch (error: unknown) {
            throw ChannelMessageService.handleError(error);
        }
    }

    /**
     * @function create
     * @description Create a channel message
     * @param {FormData} formData - The channel message form data
     * @param {string} formData.uuid - The channel message uuid
     * @param {string} formData.channel_uuid - The channel uuid
     * @param {string} formData.body - The channel message body
     * @param {string} formData.file - The channel message file attachment
     * @returns {Promise<ChannelMessage>} channel message
     * @throws {Error} if the uuid is invalid
     * @throws {Error} if the channel_uuid is invalid
     * @throws {Error} if the body is not provided
     */
    static create = async (formData: FormData): Promise<ChannelMessage> => {
        if (!uuidValidate(formData.get('uuid') as string)) throw new Error('Invalid uuid');
        if (!uuidValidate(formData.get('channel_uuid') as string)) throw new Error('Invalid channel_uuid');
        if (!formData.get('body')) throw new Error('body is required');

        try {
            const response = await ApiService.builder()
                .endpoint(`/channel_message`)
                .method(BuilderMethods.POST)
                .body(formData)
                .auth()
                .execute() as ChannelMessageResponse;

            return response.data;
        } catch (error: unknown) {
            throw ChannelMessageService.handleError(error);
        }
    }

    /**
     * @function update
     * @description Update a channel message
     * @param {string} uuid - The channel message uuid
     * @param {ChannelMessageUpdateInput} channelMessageUpdateInput - The channel message update input
     * @param {string} channelMessageUpdateInput.body - The channel message body
     * @returns {Promise<ChannelMessage>} channel message
     * @throws {Error} if the uuid is invalid
     * @throws {Error} if the body is not provided
     */
    static update = async (uuid: string, channelMessageUpdateInput: ChannelMessageUpdateInput): Promise<ChannelMessage> => {
        if (!uuidValidate(uuid)) throw new Error('Invalid uuid');
        if (!channelMessageUpdateInput.body) throw new Error('body is required');

        try {
            const response = await ApiService.builder()
                .endpoint(`/channel_message/${uuid}`)
                .method(BuilderMethods.PATCH)
                .body(channelMessageUpdateInput)
                .auth()
                .execute() as ChannelMessageResponse;

            return response.data;
        } catch (error: unknown) {
            throw ChannelMessageService.handleError(error);
        }
    }

    /**
     * @function destroy
     * @description Destroy a channel message
     * @param {string} uuid - The channel message uuid
     * @returns {Promise<void>} void
     * @throws {Error} if the uuid is invalid
     */
    static destroy = async (uuid: string): Promise<void> => {
        if (!uuidValidate(uuid)) throw new Error('Invalid uuid');

        try {
            await ApiService.builder()
                .endpoint(`/channel_message/${uuid}`)
                .method(BuilderMethods.DELETE)
                .auth()
                .execute();
        } catch (error: unknown) {
            throw ChannelMessageService.handleError(error);
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
                .execute() as ChannelMessageTypesResponse;

            const { data } = response.data;
            return data;
        } catch (error: unknown) {
            throw ChannelMessageService.handleError(error);
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
