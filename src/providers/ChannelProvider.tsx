import { useState, JSX } from 'react';
import { ChannelContext } from '../context/channelContext';
import Channel from '../models/channel';
import useChannels from '../hooks/useChannels';

/**
 * @interface ChannelProviderProps
 * @description The channel provider props
 */
interface ChannelProviderProps {
    slot: JSX.Element;
}

/**
 * @function ChannelProvider
 * @description The channel provider
 * @param {ChannelProviderProps} props - The props
 * @returns {JSX.Element} JSX.Element
 */
function ChannelProvider(props: ChannelProviderProps): JSX.Element {
    const { channels, setChannels } = useChannels();
    const [ selectedChannel, setSelectedChannel ] = useState<Channel | null>(null);
    const { slot } = props;

    return (
        <ChannelContext.Provider value={{ selectedChannel, channels, setSelectedChannel, setChannels }}>
            {slot}
        </ChannelContext.Provider>
    );
}

export default ChannelProvider;
