import { WebsocketContext } from '../context/websocketContext';
import { JSX } from 'react';
import useWebsockets from '../hooks/useWebsockets';

/**
 * @interface WebsocketProviderProps
 * @description The websocket provider props
 */
interface WebsocketProviderProps {
    slot: JSX.Element;
}

/**
 * @function WebsocketProvider
 * @description The websocket provider
 * @param {WebsocketProviderProps} props - The props
 * @returns {JSX.Element} JSX.Element
 */
function WebsocketProvider(props: WebsocketProviderProps): JSX.Element {
    const { slot } = props;
    const { joinChannel, leaveChannel, onMessage } = useWebsockets();
    
    return (
        <WebsocketContext.Provider value={{ joinChannel, leaveChannel, onMessage }}>
            {slot}
        </WebsocketContext.Provider>
    );
}

export default WebsocketProvider;
