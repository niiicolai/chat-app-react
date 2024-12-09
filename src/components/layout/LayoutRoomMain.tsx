import RoomHeader from "../room/RoomHeader";
import ChannelList from "../channel/ChannelList";
import LayoutMain from "./LayoutMain";
import Spinner from "../utils/Spinner";
import Alert from "../utils/Alert";
import ReactMarkdown from 'react-markdown';
import { JSX, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetRoom } from "../../hooks/useRooms";

interface LayoutRoomMainProps {
    slot: JSX.Element;
}

/**
 * @function LayoutRoomMain
 * @description The room main layout
 * @returns {JSX.Element} JSX.Element
 */
function LayoutRoomMain(props:LayoutRoomMainProps): JSX.Element {
    const { slot } = props;
    const { room_uuid } = useParams<{ room_uuid: string }>();
    const { data: room, isLoading, error } = useGetRoom(room_uuid as string).query;
    const [showRules, setShowRules] = useState(false);

    return (
        <LayoutMain slot={
            <>
                <Alert type="error" message={error} />

                {isLoading && (
                    <div className="w-full h-full flex items-center justify-center">
                        <Spinner isLoading={isLoading} width="2em" fill="white" />
                        <p>Loading room...</p>
                    </div>
                )}

                {!isLoading && room && (
                    <div className="w-full flex flex-col">
                        <RoomHeader room={room} />
                        <div className="block sm:flex h-full sm:overflow-hidden">
                            <ChannelList setShowRules={setShowRules} showRules={showRules} room={room} />

                            {showRules && room &&
                                <div className="bg-black w-full sm:flex flex-col justify-between sm:border-l border-t sm:border-t-0 border-gray-800 relative overflow-y-auto">
                                    <div className="w-full flex flex-col items-center justify-center p-3 sm:border-l border-t sm:border-t-0 border-gray-800">
                                        <div className="markdown" data-testid="room-rules-text-output">
                                            <ReactMarkdown>{room.rulesSettings.rules_text}</ReactMarkdown>
                                        </div>
                                    </div>
                                </div>
                            }

                            {!showRules && <>{slot}</>}
                        </div>
                    </div>
                )}
            </>
        } />
    )
}

export default LayoutRoomMain;
