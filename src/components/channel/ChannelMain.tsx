import ChannelMessageMain from "../channel_message/ChannelMessageMain";
import ChannelList from "./ChannelList";
import ChannelHeader from "./ChannelHeader";
import ChannelUpdate from "./ChannelUpdate";
import Channel from "../../models/channel";
import { useState, useContext, JSX } from "react";
import { ChannelContext } from "../../context/channelContext";

/**
 * @function ChannelMain
 * @returns {JSX.Element}
 */
const ChannelMain = (): JSX.Element => {
    const [ editChannel, setEditChannel ] = useState<Channel | null>(null);
    const { selectedChannel } = useContext(ChannelContext);

    return (
        <div className="block sm:flex h-full sm:overflow-hidden">
            <ChannelUpdate editChannel={editChannel} setEditChannel={setEditChannel} />
            <ChannelList />

            {!selectedChannel &&
                <div className="w-full sm:h-full sm:flex flex-col justify-between sm:border-l border-t sm:border-t-0 border-gray-800 relative">
                    <div className="w-full sm:h-full flex flex-col items-center justify-center p-3 sm:border-l border-t sm:border-t-0 border-gray-800">
                        <p className="text-white ml-3">Select a channel to view messages</p>
                    </div>
                </div>
            }

            {selectedChannel &&
                <div className="w-full sm:h-full sm:flex flex-col justify-between sm:border-l border-t sm:border-t-0 border-gray-800 relative">
                    <ChannelHeader setEditChannel={setEditChannel} />
                    <ChannelMessageMain />
                </div>
            }

        </div>
    );
};

export default ChannelMain;
