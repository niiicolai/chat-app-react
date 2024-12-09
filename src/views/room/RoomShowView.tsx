import LayoutRoomMain from "../../components/layout/LayoutRoomMain";
import { JSX } from "react";

/**
 * @function RoomShowView
 * @description The room show view
 * @returns {JSX.Element} JSX.Element
 */
function RoomShowView(): JSX.Element {
    return (
        <LayoutRoomMain slot={
            <div className="w-full sm:h-full sm:flex flex-col justify-between sm:border-l border-t sm:border-t-0 border-gray-800 relative">
                <div className="w-full sm:h-full flex flex-col items-center justify-center p-3 sm:border-l border-t sm:border-t-0 border-gray-800">
                    <p className="text-white ml-3" data-testid="channel-main-no-channel-selected">Select a channel to view messages</p>
                </div>
            </div>
        } />
    )
}

export default RoomShowView;
