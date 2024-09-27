import ChannelListItem from "./ChannelListItem";
import ResMenu from "../utils/ResMenu";
import { useContext, ReactNode } from "react";
import { ChannelContext } from "../../context/channelContext";

/**
 * @function ChannelList
 * @returns {ReactNode}
 */
const ChannelList = (): ReactNode => {
    const { selectedChannel, setSelectedChannel, channels } = useContext(ChannelContext);

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
                        {channels.map((channel) => 
                            <ChannelListItem key={channel.uuid} 
                                isSelected={channel.uuid===selectedChannel?.uuid} 
                                channel={channel} 
                                setChannel={setSelectedChannel} 
                            />
                        )}
                    </ul>
                </div>
            } />
        </div>
    );
};

export default ChannelList;
