import ChannelListItem from "./ChannelListItem";
import ResMenu from "../utils/ResMenu";
import { useContext, JSX, useState } from "react";
import { ChannelContext } from "../../context/channelContext";
import { RoomContext } from "../../context/roomContext";
import ChannelService from "../../services/channelService";
import Button from "../utils/Button";
import Channel from "../../models/channel";
import Paginator from "../utils/Paginator";

/**
 * @interface ChannelListProps
 * @description The props for the ChannelList component
 */
interface ChannelListProps {
    setShowRules: (show: boolean) => void;
    showRules: boolean;
}

/**
 * @function ChannelList
 * @returns {JSX.Element}
 */
const ChannelList = (props: ChannelListProps): JSX.Element => {
    const { selectedChannel, setSelectedChannel, channels, setChannels, setTotal, setPages, pages } = useContext(ChannelContext);
    const { selectedRoom } = useContext(RoomContext);
    const { showRules, setShowRules } = props;
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const limit = 5;

    const selectChannelHandler = (channel: Channel | null) => {
        setSelectedChannel(channel);
        setShowRules(false);
    };

    const showRulesHandler = () => {
        setSelectedChannel(null);
        setShowRules(true);
    };

    const paginate = (page: number, limit: number) => {
        if (!selectedRoom) return;
        setIsLoading(true);
        ChannelService.findAll(selectedRoom.uuid, page, limit)
            .then(({ data: channels, total, pages }: { data: Channel[], total: number, pages: number }) => {
                setChannels(channels);
                setTotal(total);
                setError("");
                setPages(pages);
            })
            .catch((err: unknown) => {
                if (err instanceof Error) setError(err.message);
                else setError("An unknown error occurred");
            })
            .finally(() => setIsLoading(false));
    }

    const previousPage = () => {
        if (!selectedRoom) return;
        if (pages <= 1) return;
        if (page === 1) return;
        setPage(page - 1);
        paginate(page - 1, limit);
    }

    const nextPage = () => {
        if (!selectedRoom) return;
        if (pages <= 1) return;
        if (page === pages) return;
        setPage(page + 1);
        paginate(page + 1, limit);
    }

    if (!channels.length) return (
        <div className="w-full sm:w-64 flex flex-col items-center justify-center gap-3 p-3 text-center" data-testid="channel-list-empty">
            <p className="text-white">No channels to join, but you can fix that! Start a new one now! 🚀</p>
        </div>
    )

    return (
        <div className="p-3 w-64">
            <ResMenu type="primary" title="Channels" stickDirection="left-0" slot={
                <div className="p-3 sm:p-0">
                    <p className="font-bold text-lg text-white mb-3 sm:hidden">Channels</p>
                    <Paginator isLoading={isLoading} error={error} nextPage={nextPage} previousPage={previousPage} page={page} pages={pages} slot={
                        <ul className="flex flex-col gap-3" data-testid="channel-list">
                            <li>
                                <Button type="primary" title="Show rules" display={`${showRules ? 'ring-2 ring-gray-500 hover:ring-gray-500' : ''} w-full text-xs p-1`}
                                    onClick={showRulesHandler} slot={
                                        <span className="text-white">README</span>
                                    } />
                            </li>
                            {channels.map((channel) =>
                                <ChannelListItem key={channel.uuid}
                                    isSelected={channel.uuid === selectedChannel?.uuid}
                                    channel={channel}
                                    setChannel={selectChannelHandler}
                                />
                            )}
                        </ul>
                    } />
                </div>
            } />
        </div>
    );
};

export default ChannelList;
