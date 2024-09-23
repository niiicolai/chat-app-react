import ChannelWebhookService from "../services/channelWebhookService";
import ChannelWebhook from "../models/channel_webhook";
import { useEffect, useState, useContext } from "react";
import { RoomContext } from "../context/roomContext";

const useChannelWebhooks = () => {
    const { selectedRoom } = useContext(RoomContext);
    const [webhooks, setWebhooks] = useState<ChannelWebhook[]>([]);
    const [error, setError] = useState("");
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        if (!selectedRoom) return;

        setLoading(true);
        ChannelWebhookService.findAll(selectedRoom.uuid)
            .then(setWebhooks)
            .catch((err: any) => setError(err.message))
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
