import { useEffect, useState } from "react";
import ChannelService from "../services/channelService";
import ChannelType from "../models/channel_type";

/**
 * @interface UseChannelTypes
 * @description The channel types hook interface
 */
interface UseChannelTypes {
    channelTypes: ChannelType[];
    setChannelTypes: (channelTypes: ChannelType[]) => void;
    error: string;
    isLoading: boolean;
}

/**
 * @function useChannelTypes
 * @description The channel types hook
 * @returns {UseChannelTypes} The channel types hook
 */
const useChannelTypes = (): UseChannelTypes => {
    const [channelTypes, setChannelTypes] = useState<ChannelType[]>([]);
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        setLoading(true);
        ChannelService.channelTypes()
            .then(setChannelTypes)
            .catch((err: unknown) => {
                if (err instanceof Error) setError(err.message);
                else setError("An unknown error occurred");
            })
            .finally(() => setLoading(false));

        return () => { }
    }, []);

    return {
        channelTypes,
        setChannelTypes,
        isLoading,
        error,
    };
}

export default useChannelTypes;
