import Modal from "../utils/Modal";
import RoomListItem from "./RoomListItem";
import Room from "../../models/room";
import { useContext, JSX } from "react";
import { RoomContext } from "../../context/roomContext";
import { ChannelContext } from "../../context/channelContext";

/**
 * @interface RoomListProps
 * @description The props for the RoomList component
 */
interface RoomListProps {
  browseRooms: boolean;
  setBrowseRooms: (show: boolean) => void;
}

/**
 * @function RoomList
 * @param {RoomListProps} props
 * @returns {JSX.Element}
 */
const RoomList = (props: RoomListProps): JSX.Element => {
  const { setSelectedRoom, rooms } = useContext(RoomContext);
  const { setSelectedChannel } = useContext(ChannelContext);
  const { browseRooms, setBrowseRooms } = props;

  const selectRoom = (room: Room) => {
    setSelectedRoom(room);
    setBrowseRooms(false);
    setSelectedChannel(null);
  }

  return (
    <Modal title="Rooms" show={browseRooms} setShow={setBrowseRooms} slot={
      <div>
        <ul className="flex flex-col gap-3 mb-3">
          {rooms.map((room) => (<RoomListItem key={room.uuid} room={room} setRoom={selectRoom} />))}
          {!rooms.length && <li className="text-white">No rooms found</li>}
        </ul>
      </div>
    } />
  );
};

export default RoomList;
