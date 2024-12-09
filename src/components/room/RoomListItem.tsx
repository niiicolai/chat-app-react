import Button from "../utils/Button";
import Room from "../../models/room";
import { JSX } from "react";
import { useNavigate } from "react-router-dom";

/**
 * @interface RoomListItemProps
 * @description The props for the RoomListItem component
 */
interface RoomListItemProps {
    room: Room;
}

/**
 * @function RoomListItem
 * @param {RoomListItemProps} props
 * @returns {JSX.Element}
 */
const RoomListItem = (props: RoomListItemProps): JSX.Element => {
    const navigate = useNavigate();
    const { room } = props;

    return (
        <li key={room.uuid} className="hover:ring-2 hover:ring-indigo-800 relative rounded-md overflow-hidden" data-testid="room-list-item">
            <Button onClick={() => navigate(`/room/${room.uuid}`)}
                button="button"
                type="primary"
                testId="room-list-item-button"
                slot={
                    <span className="block p-3 text-left">
                        <span className="absolute left-0 right-0 top-0 bottom-0 z-10"
                            style={{
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                                backgroundImage: room?.avatar?.room_file
                                    ? `url(${room.avatar.room_file.src})`
                                    : 'none',
                            }} />
                        <span className="absolute left-0 right-0 top-0 bottom-0 bg-black/20 z-20" />
                        <span className="block relative font-bold text-lg z-30">
                            {room.name}
                        </span>
                        <span className="block relative font-bold text-sm z-30">
                            {room.description}
                        </span>
                    </span>
                }
            />
        </li>
    );
};

export default RoomListItem;
