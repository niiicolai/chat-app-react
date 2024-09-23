import { createContext } from 'react';
import Channel from '../models/channel';

export const ChannelContext = createContext<{
    selectedChannel: Channel | null,
    setSelectedChannel: (channel: Channel | null) => void,
    channels: Channel[],
    setChannels: (channels: Channel[]) => void
}>({
    selectedChannel: null,
    setSelectedChannel: () => { },
    channels: [],
    setChannels: () => { }
});
