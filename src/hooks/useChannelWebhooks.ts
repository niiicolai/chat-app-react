import RoomFileService from "../services/roomFileService";
import ChannelWebhookService from "../services/channelWebhookService";
import ChannelWebhook from "../models/channel_webhook";
import { useEffect, useState, useContext, FormEvent } from "react";
import { RoomContext } from "../context/roomContext";
import { ToastContext } from "../context/toastContext";

/**
 * @interface UseChannelWebhooks
 * @description The channel webhooks hook interface
 */
interface UseChannelWebhooks {
    webhooks: ChannelWebhook[];
    setWebhooks: (webhooks: ChannelWebhook[]) => void;
    error: string;
    isLoading: boolean;
    previousPage: () => void;
    nextPage: () => void;
    page: number;
    setPage: (page: number) => void;
    pages: number;
    setPages: (pages: number) => void;
    create: (e: FormEvent<HTMLFormElement>, file: string | Blob) => Promise<void>;
    update: (e: FormEvent<HTMLFormElement>, file: string | Blob) => Promise<void>;
    destroy: (uuid: string) => Promise<void>;
    testWebhook: (e: FormEvent<HTMLFormElement>) => Promise<void>;
    destroyAvatar: (channelWebhook: ChannelWebhook) => Promise<void>;
}

/**
 * @function useChannelWebhooks
 * @description The channel webhooks hook
 * @returns {UseChannelWebhooks} The channel webhooks hook
 */
const useChannelWebhooks = (): UseChannelWebhooks => {
    const { selectedRoom } = useContext(RoomContext);
    const { addToast } = useContext(ToastContext);
    const [webhooks, setWebhooks] = useState<ChannelWebhook[]>([]);
    const [error, setError] = useState("");
    const [isLoading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const limit = 10;

    const paginate = async (page: number, limit: number, onPaginate: (data: ChannelWebhook[], pages?: number) => void): Promise<void> => {
        if (!selectedRoom) return;
        setLoading(true);

        try {
            const { data, pages } = await ChannelWebhookService.findAll(selectedRoom.uuid, page, limit);
            onPaginate(data, pages);
            setError("");
        } catch (err: unknown) {
            if (err instanceof Error) setError(err.message);
            else setError("An unknown error occurred");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!selectedRoom) return;

        paginate(1, limit, (data: ChannelWebhook[], pages?: number) => {
            setWebhooks(data);
            setPages(pages ?? 1);
        });

        return () => { }
    }, [selectedRoom]);

    

    const previousPage = () => {
        if (!selectedRoom) return;
        if (pages <= 1) return;
        if (page === 1) return;
        setPage(page - 1);
        paginate(page - 1, limit, (data: ChannelWebhook[], pages?: number) => {
            setWebhooks(data);
            setPages(pages ?? 1);
        });
    }

    const nextPage = () => {
        if (!selectedRoom) return;
        if (page >= pages) return;
        setPage(page + 1);
        paginate(page + 1, limit, (data: ChannelWebhook[], pages?: number) => {
            setWebhooks(data);
            setPages(pages ?? 1);
        });
    }

    const create = async (e: FormEvent<HTMLFormElement>, file: string | Blob) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        formData.set('file', file);
        const response = await ChannelWebhookService.create(formData);
        setWebhooks([...webhooks, response]);
        addToast({ message: 'Channel webhook created', type: 'success', duration: 5000 });
    };

    const update = async (e: FormEvent<HTMLFormElement>, file: string | Blob) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        formData.set('file', file);
        const uuid = formData.get('uuid') as string;
        if (!uuid) return;
        const response = await ChannelWebhookService.update(uuid, formData);
        setWebhooks(webhooks.map((webhook: ChannelWebhook) => webhook.uuid === uuid ? response : webhook));
        addToast({ message: 'Channel webhook updated', type: 'success', duration: 5000 });
    };

    const destroy = async (uuid: string) => {
        await ChannelWebhookService.destroy(uuid);
        setWebhooks(webhooks.filter((webhook: ChannelWebhook) => webhook.uuid !== uuid));
        addToast({ message: 'Channel webhook deleted', type: 'success', duration: 5000 });
    };

    const testWebhook = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const uuid = formData.get('uuid') as string;
        const message = formData.get('message') as string;
        await ChannelWebhookService.test(uuid, { message });
        addToast({ message: 'Webhook test sent', type: 'success', duration: 5000 });
    };

    const destroyAvatar = async (channelWebhook: ChannelWebhook) => {
        if (!channelWebhook?.room_file) return;
        await RoomFileService.destroy(channelWebhook.room_file.uuid);
        setWebhooks(webhooks.map((webhook: ChannelWebhook) => webhook.uuid === channelWebhook.uuid
            ? { ...channelWebhook, room_file: null } : webhook));
        addToast({ message: 'Avatar removed', type: 'success', duration: 5000 });
    }

    return {
        webhooks,
        setWebhooks,
        error,
        isLoading,
        previousPage,
        nextPage,
        page,
        setPage,
        pages,
        setPages,
        create,
        update,
        destroy,
        testWebhook,
        destroyAvatar
    };
}

export default useChannelWebhooks;
