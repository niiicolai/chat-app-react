import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ChannelMessageService, { ChannelMessageUpdateInput } from "../services/channelMessageService";
import ChannelMessage from "../models/channel_message";
import { useEffect, useState, useContext, FormEvent } from "react";
import { ChannelContext } from "../context/channelContext";
import { WebsocketContext } from "../context/websocketContext";
import { UserContext } from "../context/userContext";
import { SocketMessage } from "./useWebsockets";
import RoomFileService from "../services/roomFileService";

export const useCreateChannelMessage = () => {
    const queryClient = useQueryClient();

    return useMutation(ChannelMessageService.create, {
        onSuccess: (channelMessage: ChannelMessage) => {
            queryClient.setQueryData(['channel_message', channelMessage.uuid], channelMessage);
        }
    });
}

export const useUpdateChannelMessage = (uuid: string) => {
    const queryClient = useQueryClient();

    return useMutation(async ({ uuid, body }: { uuid: string, body: ChannelMessageUpdateInput }) => {
        return await ChannelMessageService.update(uuid, body);
    }, {
        onSuccess: (channelMessage: ChannelMessage) => {
            queryClient.setQueryData(['channel_message', uuid],
                (prevChannelMessage: ChannelMessage | undefined) => channelMessage
            )
        }
    });
}

export const useDestroyChannelMessage = (uuid: string) => {
    const queryClient = useQueryClient();

    return useMutation(ChannelMessageService.destroy, {
        onSuccess: () => {
            queryClient.invalidateQueries(['channel_message', uuid]);
        }
    });
}

export const useDestroyUpload= (channel_message_uuid: string) => {
    const queryClient = useQueryClient();

    return useMutation(RoomFileService.destroy, {
        onSuccess: () => {
            queryClient.setQueryData(['channel_message', channel_message_uuid], 
                (prevChannelMessage: ChannelMessage | undefined) => {
                if (!prevChannelMessage) return;
                return {
                    ...prevChannelMessage,
                    channel_message_upload: null
                }
            })
        }
    });
}

export const useGetChannelMessages = (channel_uuid: string) => {
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);

    const { data, error, isLoading } = useQuery(['channel_messages', channel_uuid, page], async () => {
        const { data, pages, total } = await ChannelMessageService.findAll(channel_uuid, page, 10);
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


/**
 * @interface UseChannelMessages
 * @description The channel messages hook interface
 */
interface UseChannelMessages {
    messages: ChannelMessage[];
    setMessages: (messages: ChannelMessage[]) => void;
    isLoading: boolean;
    error: string;
    nextPage: () => void;
    maxPages: number;
    page: number;
    create: (e: FormEvent<HTMLFormElement>, file: string | Blob) => Promise<void>;
    update: (e: FormEvent<HTMLFormElement>) => Promise<void>;
    destroy: (uuid: string) => Promise<void>;
    destroyFile: (msg: ChannelMessage) => Promise<void>;
    editMessage: ChannelMessage | null;
    setEditMessage: (message: ChannelMessage | null) => void;
}

/**
 * @function useChannelMessages
 * @description The channel messages hook
 * @returns {UseChannelMessages} The channel messages hook
 */
const useChannelMessages = (): UseChannelMessages => {
    const { selectedChannel } = useContext(ChannelContext);
    const { joinChannel, leaveChannel, onMessage } = useContext(WebsocketContext);
    const { user } = useContext(UserContext);
    const [ editMessage, setEditMessage ] = useState<ChannelMessage | null>(null);
    const [ messages, setMessages ] = useState<ChannelMessage[]>([]);
    const [ isLoading, setLoading ] = useState(false);
    const [ page, setPage ] = useState(1);
    const [ maxPages, setMaxPages ] = useState(1);
    const [ error, setError ] = useState("");
    const limit = 10;

    useEffect(() => {
        if (!selectedChannel) return;
        setError("");
        setLoading(true);
        setPage(1);

        /**
         * Load the channel messages
         */
        paginate(1, limit, (data: ChannelMessage[], pages?: number) => {
            setMessages(data.reverse());
            setMaxPages(pages ?? 1);
        });

        /**
         * Subscribe to the channel messages
         */
        joinChannel(`channel-${selectedChannel?.uuid}`);
        

        /**
         * Unsubscribe from the channel messages
         * on component unmount
         */
        return () => leaveChannel();
    }, [selectedChannel]);

    onMessage(((data: SocketMessage) => {
        const message = data.payload as ChannelMessage;
        if (message?.user?.uuid === user?.uuid) return;

        switch (data.type) {
            case 'chat_message_created':
                setMessages([...messages, data.payload as ChannelMessage]);
                break;
            case 'chat_message_updated':
                setMessages(messages.map((message: ChannelMessage) => message.uuid === (data.payload as ChannelMessage).uuid
                    ? data.payload as ChannelMessage
                    : message
                ));
                break;
            case 'chat_message_deleted':
                setMessages(messages.filter((message: ChannelMessage) => message.uuid !== (data.payload as ChannelMessage).uuid));
                break;
            default:
                break;
        }
    }));

    const paginate = async (page: number, limit: number, onPaginate: (data: ChannelMessage[], pages?: number) => void) => {
        if (!selectedChannel) return;
        setError("");

        ChannelMessageService.findAll(selectedChannel.uuid, page, limit)
            .then(({ data, pages }: { data: ChannelMessage[], total: number, page?: number, pages?: number }) => {
                onPaginate(data, pages);

            })
            .catch((err: unknown) => {
                if (err instanceof Error) setError(err.message);
                else setError("An unknown error occurred");
            })
            .finally(() => setLoading(false));
    }

    const nextPage = () => {
        if (page === maxPages) return;
        const next = page + 1;
        setPage(next);
        paginate(next, limit, (data: ChannelMessage[], pages?: number) => {
            setMessages([...data.reverse(), ...messages]);
            setMaxPages(pages ?? 1);
        });
    }

    const create = async (e: FormEvent<HTMLFormElement>, file: string | Blob) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        // override the file
        form.set('file', file);
        const response = await ChannelMessageService.create(form);
        setMessages([...messages, response]);
    };

    const update = async (e: FormEvent<HTMLFormElement>) => {
        if (!editMessage) return;
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const uuid = form.get('uuid') as string;
        const body = form.get('body') as string;
        const response = await ChannelMessageService.update(uuid, { body });
        setMessages(messages.map((message: ChannelMessage) => message.uuid === response.uuid 
            ? response 
            : message
        ));
    };

    const destroy = async (uuid: string) => {
        await ChannelMessageService.destroy(uuid);
        setMessages(messages.filter((message: ChannelMessage) => message.uuid !== uuid));
    };

    const destroyFile = async (msg: ChannelMessage) => {
        if (!msg.channel_message_upload) return;
        const { uuid } = msg;
        const { uuid: fileUuid } = msg.channel_message_upload.room_file;
        await RoomFileService.destroy(fileUuid);
        setMessages(messages.map((message: ChannelMessage) => message.uuid === uuid
            ? { ...message, channel_message_upload: null }
            : message
        ));
    };

    return {
        messages,
        setMessages,
        isLoading,
        error,
        nextPage,
        maxPages,
        page,
        create,
        update,
        destroy,
        destroyFile,
        editMessage,
        setEditMessage
    };
}

export default useChannelMessages;
