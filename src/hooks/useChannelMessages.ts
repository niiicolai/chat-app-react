import ChannelMessageService from "../services/channelMessageService";
import ChannelMessage from "../models/channel_message";
import { useEffect, useState, useContext } from "react";
import { ChannelContext } from "../context/channelContext";

const useChannelMessages = () => {
    const { selectedChannel } = useContext(ChannelContext);
    const [messages, setMessages] = useState<ChannelMessage[]>([]);
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!selectedChannel) return;
        setError("");

        setLoading(true);
        ChannelMessageService.findAll(selectedChannel.uuid)
            .then(setMessages)
            .catch((err: any) => setError(err.message))
            .finally(() => setLoading(false));

        return () => { }
    }, [selectedChannel]);

    return {
        messages,
        setMessages,
        isLoading,
        error,
    };
}

export default useChannelMessages;
