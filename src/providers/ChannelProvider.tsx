import { useState, ReactNode } from 'react';
import { ChannelContext } from '../context/channelContext';
import Channel from '../models/channel';
import useChannels from '../hooks/useChannels';

/**
 * @interface ChannelProviderProps
 * @description The channel provider props
 * @param {ReactNode} slot - The slot
 */
interface ChannelProviderProps {
    slot: ReactNode;
}

/**
 * @function ChannelProvider
 * @description The channel provider
 * @param {ChannelProviderProps} props - The props
 * @returns {ReactNode} ReactNode
 */
function ChannelProvider(props: ChannelProviderProps): ReactNode {
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
