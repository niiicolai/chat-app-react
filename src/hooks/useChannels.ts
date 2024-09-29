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
    total: number;
    setTotal: (total: number) => void;
    pages: number;
    setPages: (pages: number) => void;
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
    const [total, setTotal] = useState(0);
    const [pages, setPages] = useState(1);
    const [error, setError] = useState("");
    const limit = 5;

    useEffect(() => {
        if (!selectedRoom) return;

        setLoading(true);
        ChannelService.findAll(selectedRoom.uuid, 1, limit)
            .then(({ data, total, pages }: { data: Channel[], total: number, pages: number }) => {            
                setChannels(data);
                setTotal(total);
                setPages(pages ?? 1);
                setError("");
            })
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
        total,
        setTotal,
        pages,
        setPages
    };
}

export default useChannels;
