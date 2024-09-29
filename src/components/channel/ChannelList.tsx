import ChannelListItem from "./ChannelListItem";
import ResMenu from "../utils/ResMenu";
import { useContext, JSX } from "react";
import { ChannelContext } from "../../context/channelContext";
import Button from "../utils/Button";
import Channel from "../../models/channel";


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
    const { selectedChannel, setSelectedChannel, channels } = useContext(ChannelContext);
    const { showRules, setShowRules } = props;

    const selectChannelHandler = (channel: Channel | null) => {
        setSelectedChannel(channel);
        setShowRules(false);
    };

    const showRulesHandler = () => {
        setSelectedChannel(null);
        setShowRules(true);
    };

    if (!channels.length) return (
        <div className="w-full sm:w-64 flex flex-col items-center justify-center gap-3 p-3 text-center">
            <p className="text-white">No channels to join, but you can fix that! Start a new one now! 🚀</p>
        </div>
    )

    return (
        <div className="p-3 w-64">
            <ResMenu type="primary" title="Channels" stickDirection="left-0" slot={
                <div className="p-3 sm:p-0">
                    <p className="font-bold text-lg text-white mb-3 sm:hidden">Channels</p>
                    <ul className="flex flex-col gap-3">
                        <li>
                            <Button type="primary" title="Show rules" display={`${showRules ? 'ring-2 ring-gray-500 hover:ring-gray-500' : ''} w-full text-xs p-1`}
                            onClick={showRulesHandler} slot={
                                <span className="text-white">Rules</span>
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
                </div>
            } />
        </div>
    );
};

export default ChannelList;
