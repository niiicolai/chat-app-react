import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ChannelService from "../services/channelService";
import RoomFileService from "../services/roomFileService";
import Channel from "../models/channel";
import { useState } from "react";

export const useGetChannel = (uuid: string) => {
    return useQuery(['channel', uuid], ({ queryKey }) => {
        return ChannelService.findOne(queryKey[1]);
    });
}

export const useCreateChannel = () => {
    const queryClient = useQueryClient();

    return useMutation(ChannelService.create, {
        onSuccess: (channel: Channel) => {
            queryClient.setQueryData(['channel', channel.uuid], channel);
        }
    });
}

export const useUpdateChannel = (uuid: string) => {
    const queryClient = useQueryClient();

    return useMutation(async ({ uuid, formData }: { uuid: string, formData: FormData }) => {
        return await ChannelService.update(uuid, formData);
    }, {
        onSuccess: (channel: Channel) => {
            queryClient.setQueryData(['channel', uuid],
                (prevChannel: Channel | undefined) => channel
            )
        }
    });
}

export const useDestroyChannel = (uuid: string) => {
    const queryClient = useQueryClient();

    return useMutation(ChannelService.destroy, {
        onSuccess: () => {
            queryClient.invalidateQueries(['channel', uuid]);
        }
    });
}

export const useDestroyAvatar = (channel_uuid: string) => {
    const queryClient = useQueryClient();

    return useMutation(RoomFileService.destroy, {
        onSuccess: () => {
            queryClient.setQueryData(['channel', channel_uuid], (prevChannel: Channel | undefined) => {
                if (!prevChannel) return;
                return {
                    ...prevChannel,
                    room_file: null
                }
            })
        }
    });
}

export const useGetChannels = (room_uuid: string) => {
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);

    const { data, error, isLoading } = useQuery(['channels', room_uuid, page], async () => {
        const { data, pages, total } = await ChannelService.findAll(room_uuid, page, 10);
        setPages(pages ?? 1);
        return { data, pages, total };
    }, {
        keepPreviousData: true,
    });

    return {
        page,
        pages,
        data,
        error,
        isLoading,
        nextPage: () => setPage(page < pages ? page + 1 : page),
        previousPage: () => setPage(page > 1 ? page - 1 : page),
    };
}
