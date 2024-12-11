import TokenService from "../services/tokenService";
import ChannelMessage from '../models/channel_message';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from "react";

/**
 * @constant WEBSOCKET_URL
 * @description The websocket url
 * @example ws://localhost:3001
 */
const WEBSOCKET_URL = import.meta.env.VITE_WS_URL;
if (!WEBSOCKET_URL) console.error('CONFIGURATION ERROR(useWebsockets.ts): WEBSOCKET_URL should be set in the .env file');

/**
 * @constant WEBSOCKET_DB
 * @description The websocket db
 * @example mysql
 */
const WEBSOCKET_DB = import.meta.env.VITE_WS_DB;
if (!WEBSOCKET_DB) console.error('CONFIGURATION ERROR(useWebsockets.ts): WEBSOCKET_DB should be set in the .env file');

/**
 * @constant DEBUG
 * @description The debug flag
 * @example true
 */
const DEBUG = import.meta.env.VITE_DEBUG === 'true';

/**
 * @constant WS_PROTOCOL
 * @description The websocket protocol
 * @example echo-protocol
 */
const WS_PROTOCOL = 'echo-protocol';

/**
 * @interface SocketMessage
 * @description The socket message interface
 */
export interface SocketMessage {
    type: string;
    channel?: string;
    error?: string;
    payload?: unknown;
}

/**
 * @interface UseUser
 * @description The user hook interface
 */
interface UseWebsocket {
    leaveChannel: () => void;
    joinChannel: () => void;
    socket: WebSocket;
}

/**
 * @function useWebsocket
 * @description The websocket hook
 * @returns {UseWebsocket} The websocket hook
 */
export const useWebsocket = (channel_uuid: string): UseWebsocket => {
    const queryClient = useQueryClient();
    const [socket] = useState(new WebSocket(WEBSOCKET_URL, WS_PROTOCOL));

    socket.onopen = () => {
        if (DEBUG) console.log('WebSocket connection');
    };

    socket.onclose = () => {
        if (DEBUG) console.log('WebSocket disconnection');
        leaveChannel();
    };

    socket.onerror = (error) => {
        console.error('WebSocket error:', error);
    };

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.error) {
            console.error('WebSocket error:', data.error);
            return;
        } else if (data.type === 'chat_message_created') {
            const payload = data.payload as ChannelMessage;

            // Update the infinite query data
            queryClient.setQueryData(['channel_messages', channel_uuid],
                (prevChannelMessages: { pages: { data: ChannelMessage[] }[], pageParams: number[] } | undefined) => {
                    
                    // If there are no previous messages, create a new page
                    if (!prevChannelMessages || !prevChannelMessages.pages.length) {
                        return { pages: [{ data: [payload] }], pageParams: [] };
                    }

                    // Append the new message to the first page so it appears first
                    // and return the rest of the pages
                    return {
                        pages: [{ data: [...prevChannelMessages.pages[0].data, payload] }, ...prevChannelMessages.pages.slice(1)],
                        pageParams: prevChannelMessages.pageParams
                    };
                }
            );
        } else if (data.type === 'chat_message_updated') {
            const payload = data.payload as ChannelMessage;

            // Update the infinite query data
            queryClient.setQueryData(['channel_messages', payload.channel_uuid],
                (prevChannelMessages: { pages: { data: ChannelMessage[] }[], pageParams: number[] } | undefined) => {
                    if (!prevChannelMessages) return;

                    // Find the message and update it
                    return {
                        pages: prevChannelMessages.pages.map((page) => ({
                            data: page.data.map((message: ChannelMessage) => message.uuid === payload.uuid
                                ? payload
                                : message
                            )
                        })),
                        pageParams: prevChannelMessages.pageParams
                    };
                }
            );
        } else if (data.type === 'chat_message_deleted') {
            const uuid = data.payload as string;

            // Update the infinite query data
            queryClient.setQueryData(['channel_messages', channel_uuid],
                (prevChannelMessages: { pages: { data: ChannelMessage[] }[], pageParams: number[] } | undefined) => {
                    if (!prevChannelMessages) return;

                    // Remove the message from the data
                    return {
                        pages: prevChannelMessages.pages.map((page) => ({
                            data: page.data.filter((message: ChannelMessage) => message.uuid !== uuid)
                        })),
                        pageParams: prevChannelMessages.pageParams
                    };
                }
            );
        }
    };

    const joinChannel = (): void => {
        if (!socket) throw new Error('No WebSocket connection found');
        if (socket.readyState !== WebSocket.OPEN) throw new Error('WebSocket connection not open');
        
        const token = TokenService.getToken();
        if (!token) {
            throw new Error('No token found in local storage');
        }
        console.log('Joining channel:', channel_uuid);
        socket.send(JSON.stringify({ type: 'join_channel', channel: `channel-${channel_uuid}`, token: `Bearer ${token}`, db: WEBSOCKET_DB }));
    };

    const leaveChannel = (): void => {
        if (!socket) throw new Error('No WebSocket connection found');
        console.log('Leaving channel');
        socket.send(JSON.stringify({ type: 'leave_channel' }));
    };

    return { leaveChannel, joinChannel, socket };
}
