import TokenService from "../services/tokenService";
import { useRef } from "react";

/**
 * @constant WEBSOCKET_URL
 * @description The websocket url
 * @example ws://localhost:3001
 */
const WEBSOCKET_URL = import.meta.env.VITE_WS_URL;
if (!WEBSOCKET_URL) console.error('CONFIGURATION ERROR(useWebsockets.ts): WEBSOCKET_URL should be set in the .env file');

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
interface SocketMessage {
    type: string;
    channel?: string;
    error?: string;
}

/**
 * @interface UseUser
 * @description The user hook interface
 */
interface UseWebsocket {
    onChatMessage: (cb: (data: SocketMessage) => void) => void;
    joinChannel: (channel: string) => void;
    leaveChannel: () => void;
    socket: WebSocket | null;
}

/**
 * @function useWebsocket
 * @description The websocket hook
 * @returns {UseWebsocket} The websocket hook
 */
const useWebsocket = (): UseWebsocket => {
    const onChatMessageCallbacks = useRef<Array<(data: SocketMessage) => void>>([]);
    const socket = new WebSocket(WEBSOCKET_URL, WS_PROTOCOL);

    socket.onopen = () => {
        if (DEBUG) console.log('WebSocket connection');
    };

    socket.onclose = () => {
        if (DEBUG) console.log('WebSocket disconnection');
    };

    socket.onerror = (error) => {
        console.error('WebSocket error:', error);
    };

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.error) {
            console.error('WebSocket error:', data.error);
            return;
        } else if (data.type === 'chat_message') {
            if (onChatMessageCallbacks.current) {
                onChatMessageCallbacks.current.forEach(cb => cb(data));
            }
        }
    };

    const onChatMessage = (cb: (data: SocketMessage) => void): void => {
        onChatMessageCallbacks.current?.push(cb);
    };

    const joinChannel = (channel: string): void => {
        if (!socket) {
            throw new Error('No WebSocket connection found');
        }
        const token = TokenService.getToken();
        if (!token) {
            throw new Error('No token found in local storage');
        }
        socket.send(JSON.stringify({ type: 'join_channel', channel, token: `Bearer ${token}` }));
    };

    const leaveChannel = (): void => {
        if (!socket) {
            throw new Error('No WebSocket connection found');
        }
        socket.send(JSON.stringify({ type: 'leave_channel' }));
    };

    return {
        onChatMessage,
        joinChannel,
        leaveChannel,
        socket
    };
}

export default useWebsocket;
