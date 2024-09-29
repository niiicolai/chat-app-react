import ApiService, { BuilderResponse, BuilderMethods } from "./apiService";
import { validate as uuidValidate } from 'uuid';
import Channel from "../models/channel";
import ChannelType from "../models/channel_type";

/**
 * @interface ChannelResponse
 * @description The channel response
 * @param {Channel} data - The channel
 */
interface ChannelResponse extends BuilderResponse {
    data: Channel;
}

/**
 * @interface ChannelsResponse
 * @description The channels response
 * @param {Channel[]} data - The channels
 */
interface ChannelsResponse extends BuilderResponse {
    data: {
        data: Channel[];
        total: number;
        pages: number;
    };
}

/**
 * @interface ChannelTypesResponse
 * @description The channel types response
 * @param {ChannelMessageType[]} data - The channel types
 */
interface ChannelTypesResponse extends BuilderResponse {
    data: {
        data: ChannelType[];
    };
}

/**
 * @class ChannelService
 * @description Service for the channel
 */
export default class ChannelService {

    /**
     * @function findOne
     * @description Find a channel by uuid
     * @param {string} uuid - The channel uuid
     * @returns {Promise<Channel>} channel
     * @throws {Error} if the uuid is invalid
     */
    static findOne = async (uuid: string): Promise<Channel> => {
        if (!uuidValidate(uuid)) throw new Error('Invalid uuid');

        try {
            const response = await ApiService.builder()
                .endpoint(`/channel/${uuid}`)
                .method(BuilderMethods.GET)
                .execute() as ChannelResponse;

            return response.data;
        } catch (error: unknown) {
            throw ChannelService.handleError(error);
        }
    }

    /**
     * @function findAll
     * @description Find all channels for a room
     * @param {params} room_uuid - The room uuid
     * @param {params} page - The page number (optional)
     * @param {params} limit - The limit number (optional)
     * @returns {Promise<Channel[]>} channels
     * @throws {Error} if the room_uuid is invalid
     * @throws {Error} if the page is not a number
     * @throws {Error} if the limit is not a number
     */
    static findAll = async (room_uuid: string, page?: number, limit?: number): Promise<{ data: Channel[], total: number, pages: number }> => {
        if (!uuidValidate(room_uuid)) throw new Error('Invalid room_uuid');
        if (page && typeof page !== 'number') throw new Error('If provided, page must be a number');
        if (limit && typeof limit !== 'number') throw new Error('If provided, limit must be a number');

        try {
            const response = await ApiService.builder()
                .endpoint(`/channels`)
                .parameter('page', page)
                .parameter('limit', limit)
                .parameter('room_uuid', room_uuid)
                .method(BuilderMethods.GET)
                .auth()
                .execute() as ChannelsResponse;

            const { total, pages, data }  = response.data;
            return { data, total, pages };
        } catch (error: unknown) {
            throw ChannelService.handleError(error);
        }
    }

    /**
     * @function create
     * @description Create a channel
     * @param {FormData} formData - The channel form data
     * @param {string} formData.uuid - The channel uuid
     * @param {string} formData.room_uuid - The room uuid
     * @param {string} formData.name - The channel name
     * @param {string} formData.description - The channel description
     * @param {string} formData.channel_type_name - The channel type name
     * @param {string} formData.file - The channel avatar file (optional)
     * @returns {Promise<Channel>} channel
     * @throws {Error} if the uuid is invalid
     * @throws {Error} if the room_uuid is invalid
     * @throws {Error} if the name is not provided
     * @throws {Error} if the description is not provided
     * @throws {Error} if the channel_type_name is not provided
     */
    static create = async (formData: FormData): Promise<Channel> => {
        if (!uuidValidate(formData.get('uuid') as string)) throw new Error('Invalid uuid');
        if (!uuidValidate(formData.get('room_uuid') as string)) throw new Error('Invalid room_uuid');
        if (!formData.get('name')) throw new Error('Name is required');
        if (!formData.get('description')) throw new Error('Description is required');
        if (!formData.get('channel_type_name')) throw new Error('Channel type name is required');

        try {
            const response = await ApiService.builder()
                .endpoint(`/channel`)
                .method(BuilderMethods.POST)
                .body(formData)
                .auth()
                .execute() as ChannelResponse;

            return response.data;
        } catch (error: unknown) {
            throw ChannelService.handleError(error);
        }
    }

    /**
     * @function update
     * @description Update a channel
     * @param {string} uuid - The channel uuid
     * @param {FormData} formData - The channel form data
     * @param {string} formData.name - The channel name (optional)
     * @param {string} formData.description - The channel description (optional)
     * @param {string} formData.channel_type_name - The channel type name (optional)
     * @returns {Promise<Channel>} channel
     */
    static update = async (uuid: string, formData: FormData): Promise<Channel> => {
        if (!uuidValidate(uuid)) throw new Error('Invalid uuid');
        if (formData.get('name') && typeof formData.get('name') !== 'string') throw new Error('Name must be a string');
        if (formData.get('description') && typeof formData.get('description') !== 'string') throw new Error('Description must be a string');
        if (formData.get('channel_type_name') && typeof formData.get('channel_type_name') !== 'string') throw new Error('Channel type name must be a string');

        try {
            const response = await ApiService.builder()
                .endpoint(`/channel/${uuid}`)
                .method(BuilderMethods.PATCH)
                .body(formData)
                .auth()
                .execute() as ChannelResponse;

            return response.data;
        } catch (error: unknown) {
            throw ChannelService.handleError(error);
        }
    }

    /**
     * @function destroy
     * @description Destroy a channel
     * @param {string} uuid - The channel uuid
     * @returns {Promise<void>} void
     * @throws {Error} if the uuid is invalid
     */
    static destroy = async (uuid: string): Promise<void> => {
        if (!uuidValidate(uuid)) throw new Error('Invalid uuid');
        
        try {
            await ApiService.builder()
                .endpoint(`/channel/${uuid}`)
                .method(BuilderMethods.DELETE)
                .auth()
                .execute();
        } catch (error: unknown) {
            throw ChannelService.handleError(error);
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
                .execute() as ChannelTypesResponse;

            const { data } = response.data;
            return data;
        } catch (error: unknown) {
            throw ChannelService.handleError(error);
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
