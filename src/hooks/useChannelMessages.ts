import { useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import ChannelMessageService, { ChannelMessageUpdateInput } from "../services/channelMessageService";
import ChannelMessage from "../models/channel_message";
import RoomFileService from "../services/roomFileService";

export const useCreateChannelMessage = () => {
    const queryClient = useQueryClient();

    return useMutation(ChannelMessageService.create, {
        onSuccess: (channelMessage: ChannelMessage) => {

            // Update the infinite query data
            queryClient.setQueryData(['channel_messages', channelMessage.channel_uuid],
                (prevChannelMessages: { pages: { data: ChannelMessage[] }[], pageParams: number[] } | undefined) => {
                    
                    // If there are no previous messages, create a new page
                    if (!prevChannelMessages || !prevChannelMessages.pages.length) {
                        return { pages: [{ data: [channelMessage] }], pageParams: [] };
                    }

                    // Append the new message to the first page so it appears first
                    // and return the rest of the pages
                    return {
                        pages: [{ data: [...prevChannelMessages.pages[0].data, channelMessage] }, ...prevChannelMessages.pages.slice(1)],
                        pageParams: prevChannelMessages.pageParams
                    };
                }
            );
        }
    });
}

export const useUpdateChannelMessage = () => {
    const queryClient = useQueryClient();

    return useMutation(async ({ uuid, body }: { uuid: string, body: ChannelMessageUpdateInput }) => {
        return await ChannelMessageService.update(uuid, body);
    }, {
        onSuccess: (channelMessage: ChannelMessage) => {
            // Update the infinite query data
            queryClient.setQueryData(['channel_messages', channelMessage.channel_uuid],
                (prevChannelMessages: { pages: { data: ChannelMessage[] }[], pageParams: number[] } | undefined) => {
                    if (!prevChannelMessages) return;

                    // Find the message and update it
                    return {
                        pages: prevChannelMessages.pages.map((page) => ({
                            data: page.data.map((message: ChannelMessage) => message.uuid === channelMessage.uuid
                                ? channelMessage
                                : message
                            )
                        })),
                        pageParams: prevChannelMessages.pageParams
                    };
                }
            );
        }
    });
}

export const useDestroyChannelMessage = () => {
    const queryClient = useQueryClient();

    return useMutation(async ({ uuid, channel_uuid }: { uuid: string, channel_uuid: string }) => {
        await ChannelMessageService.destroy(uuid);
        return { uuid, channel_uuid };
    }, {
        onSuccess: ({ uuid, channel_uuid }: { uuid: string, channel_uuid: string }) => {
            // Update the infinite query data
            queryClient.setQueryData(['channel_messages', channel_uuid],
                (prevChannelMessages: { pages: { data: ChannelMessage[] }[], pageParams: number[] } | undefined) => {
                    if (!prevChannelMessages) return;

                    // Remove the message from the data
                    return {
                        pages: prevChannelMessages.pages.map((page) => ({
                            data: page.data.filter((message: ChannelMessage) => message.uuid !== uuid)
                        })),
                        pageParams: prevChannelMessages.pageParams
                    };
                }
            );
        }
    });
}

export const useDestroyUpload = () => {
    const queryClient = useQueryClient();

    return useMutation(async ({ room_file_uuid, channel_message_uuid, channel_uuid }: 
        { room_file_uuid: string, channel_message_uuid: string, channel_uuid: string }) => {
        await RoomFileService.destroy(room_file_uuid);
        return { channel_message_uuid, channel_uuid };
    }, {
        onSuccess: ({ channel_message_uuid, channel_uuid }: { channel_message_uuid: string, channel_uuid: string }) => {
            // Update the infinite query data
            queryClient.setQueryData(['channel_messages', channel_uuid],
                (prevChannelMessages: { pages: { data: ChannelMessage[] }[], pageParams: number[] } | undefined) => {
                    if (!prevChannelMessages) return;

                    // Remove the upload from the message
                    return {
                        pages: prevChannelMessages.pages.map((page) => ({
                            data: page.data.map((message: ChannelMessage) => message.uuid === channel_message_uuid
                                ? { ...message, channel_message_upload: null }
                                : message
                            )
                        })),
                        pageParams: prevChannelMessages.pageParams
                    };
                }
            );
        }
    });
}

export const useGetChannelMessages = (channel_uuid: string) => {
    return useInfiniteQuery(['channel_messages', channel_uuid], async ({ pageParam = 1 }) => {
        const { data, pages } = await ChannelMessageService.findAll(channel_uuid, pageParam, 10);
        return { data: data.reverse(), pages };
    }, {
        getNextPageParam: (lastPage, pages) => {
            return pages.length + 1;
        },
        // The pages is reversed to display the latest page first
        select: (data) => ({
            pages: [...data.pages].reverse(),
            pageParams: [...data.pageParams].reverse(),
        }),
    });
}

export const useSetHasUnreadMessages = (channel_uuid: string) => {
    const queryClient = useQueryClient();
    
    return useMutation(async (hasUnreadMessages: boolean) => {
            return Promise.resolve(hasUnreadMessages);
    }, {
        onSuccess: (hasUnreadMessages: boolean) => {
            queryClient.setQueryData(['channel_messages_unread', channel_uuid], hasUnreadMessages);
        }
    });
}

export const useGetHasUnreadMessages = (channel_uuid: string) => {
    return useQueryClient().getQueryData(
        ['channel_messages_unread', channel_uuid]) as boolean;
}
