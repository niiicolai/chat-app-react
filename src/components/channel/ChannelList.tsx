import ChannelListItem from "./ChannelListItem";
import ResMenu from "../utils/ResMenu";
import Paginator from "../utils/Paginator";
import Button from "../utils/Button";
import Channel from "../../models/channel";
import { JSX } from "react";
import { useGetChannels } from "../../hooks/useChannels";
import { useParams } from "react-router-dom";
import Room from "../../models/room";
import { useNavigate } from "react-router-dom";

/**
 * @interface ChannelListProps
 * @description The props for the ChannelList component
 */
interface ChannelListProps {
    setShowRules: (show: boolean) => void;
    showRules: boolean;
    room: Room;
}

/**
 * @function ChannelList
 * @returns {JSX.Element}
 */
const ChannelList = (props: ChannelListProps): JSX.Element => {
    const navigate = useNavigate();
    const { showRules, setShowRules, room } = props;
    const { channel_uuid } = useParams<{ channel_uuid: string }>();
    const getChannels = useGetChannels(room.uuid);
    const { data, isLoading, error, nextPage, previousPage, page, pages } = getChannels;
    const channels = data?.data || [];

    const setChannel = (channel: Channel) => {
        setShowRules(false);
        navigate(`/room/${channel.room_uuid}/channel/${channel.uuid}`);
    }

    return (
        <div className="p-3 w-64">
            <ResMenu type="primary" title="Channels" stickDirection="left-0" slot={
                <div className="p-3 sm:p-0">
                    <p className="font-bold text-lg text-white mb-3 sm:hidden">Channels</p>
                    <Paginator isLoading={isLoading} error={error} nextPage={nextPage} previousPage={previousPage} page={page} pages={pages} slot={
                        <ul className="flex flex-col gap-3" data-testid="channel-list">
                            <li>
                                <Button
                                    type="primary"
                                    title="Show rules"
                                    testId="channel-list-show-rules-button"
                                    display={`${showRules ? 'ring-2 ring-gray-500 hover:ring-gray-500' : ''} w-full text-xs p-1`}
                                    onClick={() => setShowRules(true)}
                                    slot={
                                        <span className="text-white">README</span>
                                    } />
                            </li>
                            {channels && channels.map((channel: Channel) =>
                                <ChannelListItem key={channel.uuid}
                                    isSelected={channel.uuid === channel_uuid}
                                    channel={channel}
                                    setChannel={setChannel}
                                />
                            )}
                            {!channels || !channels.length && (
                                <li className="w-full flex flex-col items-center justify-center gap-3 p-3 text-center" data-testid="channel-list-empty">
                                    <p className="text-white">No channels to join, but you can fix that! Start a new one now! 🚀</p>
                                </li>
                            )}
                        </ul>
                    } />
                </div>
            } />
        </div>
    );
};

export default ChannelList;
