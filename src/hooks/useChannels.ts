import ChannelService from "../services/channelService";
import Channel from "../models/channel";
import { useEffect, useState, useContext } from "react";
import { RoomContext } from "../context/roomContext";

const useChannels = () => {
    const { room } = useContext(RoomContext);
    const [channels, setChannels] = useState<Channel[]>([]);
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!room) return;

        setLoading(true);
        ChannelService.findAll(room.uuid)
            .then(setChannels)
            .catch((err: any) => setError(err.message))
            .finally(() => setLoading(false));

        return () => { }
    }, []);

    return {
        channels,
        setChannels,
        isLoading,
        error,
    };
}

export default useChannels;
