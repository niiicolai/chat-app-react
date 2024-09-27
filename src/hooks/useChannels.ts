import ChannelService from "../services/channelService";
import Channel from "../models/channel";
import { useEffect, useState, useContext } from "react";
import { RoomContext } from "../context/roomContext";

/**
 * @interface UseChannels
 * @description The channels hook interface
 */
interface UseChannels {
    channels: Channel[];
    setChannels: (channels: Channel[]) => void;
    error: string;
    isLoading: boolean;
}

/**
 * @function useChannels
 * @description The channels hook
 * @returns {UseChannels} The channels hook
 */
const useChannels = (): UseChannels => {
    const { selectedRoom } = useContext(RoomContext);
    const [channels, setChannels] = useState<Channel[]>([]);
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!selectedRoom) return;

        setLoading(true);
        ChannelService.findAll(selectedRoom.uuid)
            .then(setChannels)
            .catch((err: unknown) => {
                if (err instanceof Error) setError(err.message);
                else setError("An unknown error occurred");
            })
            .finally(() => setLoading(false));

        return () => { }
    }, [selectedRoom]);

    return {
        channels,
        setChannels,
        isLoading,
        error,
    };
}

export default useChannels;
