import { createContext } from 'react';
import { SocketMessage } from '../hooks/useWebsockets';

/**
 * @constant WebsocketContext
 * @description The websocket context
 */
export const WebsocketContext = createContext<{
    joinChannel: (channel: string) => void;
    leaveChannel: () => void;
    onMessage: (cb: (data: SocketMessage) => void) => void;
}>({
    joinChannel: () => { },
    leaveChannel: () => { },
    onMessage: () => { }
});
