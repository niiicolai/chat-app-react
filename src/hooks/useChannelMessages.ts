import ChannelMessageService from "../services/channelMessageService";
import ChannelMessage from "../models/channel_message";
import { useEffect, useState, useContext } from "react";
import { ChannelContext } from "../context/channelContext";

/**
 * @interface UseChannelMessages
 * @description The channel messages hook interface
 */
interface UseChannelMessages {
    messages: ChannelMessage[];
    setMessages: (messages: ChannelMessage[]) => void;
    isLoading: boolean;
    error: string;
}

/**
 * @function useChannelMessages
 * @description The channel messages hook
 * @returns {UseChannelMessages} The channel messages hook
 */
const useChannelMessages = (): UseChannelMessages => {
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
            .catch((err: unknown) => {
                if (err instanceof Error) setError(err.message);
                else setError("An unknown error occurred");
            })
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
