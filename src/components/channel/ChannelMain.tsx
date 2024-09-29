import ChannelMessageMain from "../channel_message/ChannelMessageMain";
import ChannelList from "./ChannelList";
import ChannelHeader from "./ChannelHeader";
import ChannelUpdate from "./ChannelUpdate";
import Channel from "../../models/channel";
import ReactMarkdown from 'react-markdown';
import { useState, useContext, JSX } from "react";
import { ChannelContext } from "../../context/channelContext";
import { RoomContext } from "../../context/roomContext";

/**
 * @function ChannelMain
 * @returns {JSX.Element}
 */
const ChannelMain = (): JSX.Element => {
    const [ editChannel, setEditChannel ] = useState<Channel | null>(null);
    const [ showRules, setShowRules ] = useState(false);
    const { selectedChannel } = useContext(ChannelContext);
    const { selectedRoom } = useContext(RoomContext);

    return (
        <div className="block sm:flex h-full sm:overflow-hidden">
            <ChannelUpdate editChannel={editChannel} setEditChannel={setEditChannel} />
            <ChannelList setShowRules={setShowRules} showRules={showRules} />

            {showRules && !selectedChannel && selectedRoom &&
                <div className="bg-black w-full sm:flex flex-col justify-between sm:border-l border-t sm:border-t-0 border-gray-800 relative overflow-y-auto">
                    <div className="w-full flex flex-col items-center justify-center p-3 sm:border-l border-t sm:border-t-0 border-gray-800">
                        <div className="markdown">
                            <ReactMarkdown>{selectedRoom.rulesSettings.text}</ReactMarkdown>
                        </div>
                    </div>
                </div>
            }

            {!showRules && !selectedChannel &&
                <div className="w-full sm:h-full sm:flex flex-col justify-between sm:border-l border-t sm:border-t-0 border-gray-800 relative">
                    <div className="w-full sm:h-full flex flex-col items-center justify-center p-3 sm:border-l border-t sm:border-t-0 border-gray-800">
                        <p className="text-white ml-3">Select a channel to view messages</p>
                    </div>
                </div>
            }

            {!showRules && selectedChannel &&
                <div className="w-full sm:h-full sm:flex flex-col justify-between sm:border-l border-t sm:border-t-0 border-gray-800 relative">
                    <ChannelHeader setEditChannel={setEditChannel} />
                    <ChannelMessageMain />
                </div>
            }

        </div>
    );
};

export default ChannelMain;
