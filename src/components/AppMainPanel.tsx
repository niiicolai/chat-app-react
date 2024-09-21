import RoomHeader from "./room/RoomHeader";
import ChannelList from "./channel/ChannelList";
import ChannelMessageList from "./channel_message/ChannelMessageList";
import ChannelMessageCreate from "./channel_message/ChannelMessageCreate";
import { useContext } from "react";
import { RoomContext } from "../context/roomContext";

function AppMainPanel() {
    const { room } = useContext(RoomContext);

    if (!room) return (
        <h1 className="text-lg font-bold text-center flex items-center justify-center w-full h-full">
            No room selected
        </h1>
    );

    return (
        <div className="w-full flex flex-col">
            <RoomHeader />
            <div className="block sm:flex h-full sm:overflow-hidden">
                <ChannelList />
                <div className="w-full sm:h-full sm:flex flex-col justify-between sm:border-l border-t sm:border-t-0 border-gray-800">
                    <ChannelMessageList />
                    <ChannelMessageCreate />
                </div>
            </div>
        </div>
    )
}

export default AppMainPanel
