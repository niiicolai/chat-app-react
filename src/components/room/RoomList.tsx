import Spinner from "../utils/Spinner";
import Alert from "../utils/Alert";
import Modal from "../utils/Modal";
import RoomListItem from "./RoomListItem";
import useRooms from "../../hooks/useRooms";
import { useContext } from "react";
import { RoomContext } from "../../context/roomContext";
import { ChannelContext } from "../../context/channelContext";

const RoomList = (props: any) => {
  const { setRoom } = useContext(RoomContext);
  const { setChannel } = useContext(ChannelContext);
  const { rooms, error, isLoading } = useRooms();
  const { browseRooms, setBrowseRooms } = props;

  const selectRoom = (room: any) => {
    setRoom(room);
    setBrowseRooms(false);
    setChannel(null);
  }

  return (
    <Modal title="Rooms" show={browseRooms} setShow={setBrowseRooms} slot={
      <div>
        <Alert message={error} type="error" />

        {isLoading &&
          <div className="flex flex-col items-center justify-center gap-3 p-3">
            <h1 className="text-white">Loading rooms...</h1>
            <Spinner isLoading={true} fill="white" width="16" />
          </div>
        }

        {!isLoading &&
          <ul className="flex flex-col gap-3 mb-3">
            {rooms.map((room) => (<RoomListItem key={room.uuid} room={room} setRoom={selectRoom} />))}
            {!rooms.length && <li className="text-white">No rooms found</li>}
          </ul>
        }
      </div>
    } />
  );
};

export default RoomList;
