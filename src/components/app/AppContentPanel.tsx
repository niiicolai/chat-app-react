import RoomHeader from "../room/RoomHeader";
import ChannelMain from "../channel/ChannelMain";
import { useContext, JSX } from "react";
import { RoomContext } from "../../context/roomContext";

/**
 * @function AppContentPanel
 * @description The app content panel
 * @returns {JSX.Element} JSX.Element
 */
function AppContentPanel(): JSX.Element {
    const { selectedRoom } = useContext(RoomContext);

    if (!selectedRoom) return (
        <h1 className="text-lg font-bold text-center flex items-center justify-center w-full h-full">
            No room selected
        </h1>
    );

    return (
        <div className="w-full flex flex-col">
            <RoomHeader />
            <ChannelMain />
        </div>
    )
}

export default AppContentPanel;
