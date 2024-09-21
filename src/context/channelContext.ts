import { createContext } from 'react';
import Channel from '../models/channel';

export const ChannelContext = createContext<{
    channel: Channel | null,
    setChannel: (channel: Channel | null) => void
}>({
    channel: null,
    setChannel: () => { }
});
