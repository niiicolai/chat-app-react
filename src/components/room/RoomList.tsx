import Spinner from "../utils/Spinner";
import Alert from "../utils/Alert";
import Modal from "../utils/Modal";
import RoomListItem from "./RoomListItem";
import { useContext } from "react";
import { RoomContext } from "../../context/roomContext";
import { ChannelContext } from "../../context/channelContext";
import Room from "../../models/room";

interface RoomListProps {
  browseRooms: boolean;
  setBrowseRooms: (show: boolean) => void;
}

const RoomList = (props: RoomListProps) => {
  const { setSelectedRoom, rooms } = useContext(RoomContext);
  const { setSelectedChannel } = useContext(ChannelContext);
  const { browseRooms, setBrowseRooms } = props;

  const selectRoom = (room: any) => {
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
