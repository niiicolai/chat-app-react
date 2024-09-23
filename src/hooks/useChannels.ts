import ChannelService from "../services/channelService";
import Channel from "../models/channel";
import { useEffect, useState, useContext } from "react";
import { RoomContext } from "../context/roomContext";

const useChannels = () => {
    const { selectedRoom } = useContext(RoomContext);
    const [channels, setChannels] = useState<Channel[]>([]);
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!selectedRoom) return;

        setLoading(true);
        ChannelService.findAll(selectedRoom.uuid)
            .then(setChannels)
            .catch((err: any) => setError(err.message))
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
