import Button from "../utils/Button";
import Room from "../../models/room";
import { JSX } from "react";

/**
 * @interface RoomListItemProps
 * @description The props for the RoomListItem component
 */
interface RoomListItemProps {
    room: Room;
    setRoom: (room: Room) => void;
}

/**
 * @function RoomListItem
 * @param {RoomListItemProps} props
 * @returns {JSX.Element}
 */
const RoomListItem = (props: RoomListItemProps): JSX.Element => {
    const { room, setRoom } = props;

    return (
        <li key={room.uuid} className="hover:ring-2 hover:ring-indigo-800 relative rounded-md overflow-hidden">
            <Button onClick={() => setRoom(room)}
                button="button"
                type="primary"
                slot={
                    <span className="block p-3 text-left">
                        <span className="absolute left-0 right-0 top-0 bottom-0 z-10"
                            style={{
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                                backgroundImage: room.avatar.room_file
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
