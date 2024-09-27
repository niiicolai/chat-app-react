import ChannelWebhookService from "../services/channelWebhookService";
import ChannelWebhook from "../models/channel_webhook";
import { useEffect, useState, useContext } from "react";
import { RoomContext } from "../context/roomContext";

/**
 * @interface UseChannelWebhooks
 * @description The channel webhooks hook interface
 */
interface UseChannelWebhooks {
    webhooks: ChannelWebhook[];
    setWebhooks: (webhooks: ChannelWebhook[]) => void;
    error: string;
    isLoading: boolean;
}

/**
 * @function useChannelWebhooks
 * @description The channel webhooks hook
 * @returns {UseChannelWebhooks} The channel webhooks hook
 */
const useChannelWebhooks = (): UseChannelWebhooks => {
    const { selectedRoom } = useContext(RoomContext);
    const [webhooks, setWebhooks] = useState<ChannelWebhook[]>([]);
    const [error, setError] = useState("");
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        if (!selectedRoom) return;

        setLoading(true);
        ChannelWebhookService.findAll(selectedRoom.uuid)
            .then(setWebhooks)
            .catch((err: unknown) => {
                if (err instanceof Error) setError(err.message);
                else setError("An unknown error occurred");
            })
            .finally(() => setLoading(false));

        return () => { }
    }, [selectedRoom]);

    return {
        webhooks,
        setWebhooks,
        error,
        isLoading,
    };
}

export default useChannelWebhooks;
