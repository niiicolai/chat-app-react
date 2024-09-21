import { useEffect, useState } from "react";
import ChannelService from "../services/channelService";
import ChannelType from "../models/channel_type";

const useChannelTypes = () => {
    const [channelTypes, setChannelTypes] = useState<ChannelType[]>([]);

    useEffect(() => {
        ChannelService.channelTypes()
            .then(setChannelTypes)
            .catch((err: any) => console.error(err.message));

        return () => { }
    }, []);

    return {
        channelTypes,
    };
}

export default useChannelTypes;
