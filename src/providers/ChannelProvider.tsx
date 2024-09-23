import { useState } from 'react';
import { ChannelContext } from '../context/channelContext';
import Channel from '../models/channel';
import useChannels from '../hooks/useChannels';

interface ChannelProviderProps {
    slot: any;
}

function ChannelProvider(props: ChannelProviderProps) {
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
