import ChannelWebhookService from "../services/channelWebhookService";
import ChannelWebhook from "../models/channel_webhook";
import { useEffect, useState, useContext } from "react";
import { RoomContext } from "../context/roomContext";

const useChannelWebhooks = () => {
    const { room } = useContext(RoomContext);
    const [webhooks, setWebhooks] = useState<ChannelWebhook[]>([]);
    const [error, setError] = useState("");
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        if (!room) return;

        setLoading(true);
        ChannelWebhookService.findAll(room.uuid)
            .then(setWebhooks)
            .catch((err: any) => setError(err.message))
            .finally(() => setLoading(false));

        return () => { }
    }, [room]);

    return {
        webhooks,
        setWebhooks,
        error,
        isLoading,
    };
}

export default useChannelWebhooks;
