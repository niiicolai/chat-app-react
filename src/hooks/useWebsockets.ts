import { useEffect, useState } from "react";
import UserService from "../services/userService";
import TokenService from "../services/tokenService";
import User from "../models/user";

interface UseWebsocket {
    onChatMessage: (cb: (data: any) => void) => void;
    joinChannel: (channel: string) => void;
    leaveChannel: () => void;
    socket: WebSocket | null;
}

const WEBSOCKET_URL = import.meta.env.VITE_WS_URL;
const onChatMessageCallbacks = [] as ((data: any) => void)[];

const useWebsocket = (): UseWebsocket => {
    const socket = new WebSocket(WEBSOCKET_URL, 'echo-protocol');

        socket.onopen = () => { };
        socket.onclose = () => { };
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.error) {
                console.error('WebSocket error:', data.error);
                return;
            } else if (data.type === 'chat_message') {
                onChatMessageCallbacks.forEach(cb => cb(data));
            }
        };
    

    const onChatMessage = (cb: (data: any) => void): void => {
        onChatMessageCallbacks.push(cb);
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
