import { useQuery } from '@tanstack/react-query';
import ChannelService from "../services/channelService";

export const useGetChannelTypes = () => {
    return useQuery(['room_categories'], ChannelService.channelTypes);
}
