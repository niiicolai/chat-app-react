import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import RoomFileService from "../services/roomFileService";
import ChannelWebhookService from "../services/channelWebhookService";
import ChannelWebhook from "../models/channel_webhook";
import { useState, FormEvent } from "react";

export const useGetChannelWebhook = (uuid: string) => {
    return useQuery(['channelWebhook', uuid], ({ queryKey }) => {
        return ChannelWebhookService.findOne(queryKey[1]);
    });
}

export const useCreateChannelWebhook = () => {
    const queryClient = useQueryClient();

    return useMutation(ChannelWebhookService.create, {
        onSuccess: (channelWebhook: ChannelWebhook) => {
            queryClient.setQueryData(['channelWebhook', channelWebhook.uuid], channelWebhook);
        }
    });
}

export const useUpdateChannelWebhook = (uuid: string) => {
    const queryClient = useQueryClient();

    return useMutation(async ({ uuid, formData }: { uuid: string, formData: FormData }) => {
        return await ChannelWebhookService.update(uuid, formData);
    }, {
        onSuccess: (channelWebhook: ChannelWebhook) => {
            queryClient.setQueryData(['channelWebhook', uuid],
                (prevChannelWebhook: ChannelWebhook | undefined) => channelWebhook
            )
        }
    });
}

export const useTestChannelWebhook = () => {
    return useMutation(async ({ uuid, message }: { uuid: string, message: string }) => {
        await ChannelWebhookService.test(uuid, { message });
    });
};

export const useDestroyChannelWebhook = (uuid: string) => {
    const queryClient = useQueryClient();

    return useMutation(ChannelWebhookService.destroy, {
        onSuccess: () => {
            queryClient.invalidateQueries(['channelWebhook', uuid]);
        }
    });
}

export const useDestroyAvatar = (channel_webhook_uuid: string) => {
    const queryClient = useQueryClient();

    return useMutation(RoomFileService.destroy, {
        onSuccess: () => {
            queryClient.setQueryData(['channelWebhook', channel_webhook_uuid], 
                (prevChannelWebhook: ChannelWebhook | undefined) => {
                if (!prevChannelWebhook) return;
                return {
                    ...prevChannelWebhook,
                    room_file: null
                }
            })
        }
    });
}

export const useGetChannelWebhooks = (room_uuid: string) => {
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);

    const { data, error, isLoading } = useQuery(['rooms', page], async () => {
        const { data, pages } = await ChannelWebhookService.findAll(room_uuid, page, 10);
        setPages(pages ?? 1);
        return { data, pages };
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
