import { createContext } from 'react';
import Channel from '../models/channel';

/**
 * @constant ChannelContext
 * @description The current selected channel and all selected room channels
 */
export const ChannelContext = createContext<{
    selectedChannel: Channel | null,
    setSelectedChannel: (channel: Channel | null) => void,
    channels: Channel[],
    setChannels: (channels: Channel[]) => void,
    total: number,
    setTotal: (total: number) => void
}>({
    selectedChannel: null,
    setSelectedChannel: () => { },
    channels: [],
    setChannels: () => { },
    total: 0,
    setTotal: () => { }
});
