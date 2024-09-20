import { createContext } from 'react';
import Channel from '../models/channel';

export const ChannelsContext = createContext<{
    channels: Channel[],
    setChannel: (channels: Channel[]) => void
}>({
    channels: [],
    setChannel: () => { }
});
