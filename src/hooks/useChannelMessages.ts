import ChannelMessageService from "../services/channelMessageService";
import ChannelMessage from "../models/channel_message";
import { useEffect, useState, useContext } from "react";
import { ChannelContext } from "../context/channelContext";

const useChannelMessages = () => {
    const { channel } = useContext(ChannelContext);
    const [messages, setMessages] = useState<ChannelMessage[]>([]);
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!channel) return;

        setLoading(true);
        ChannelMessageService.findAll(channel.uuid)
            .then(setMessages)
            .catch((err: any) => setError(err.message))
            .finally(() => setLoading(false));

        return () => { }
    }, [channel]);

    return {
        messages,
        setMessages,
        isLoading,
        error,
    };
}

export default useChannelMessages;
