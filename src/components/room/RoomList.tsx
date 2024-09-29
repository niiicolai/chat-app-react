import Modal from "../utils/Modal";
import RoomListItem from "./RoomListItem";
import Room from "../../models/room";
import { useContext, JSX } from "react";
import { RoomContext } from "../../context/roomContext";
import { ChannelContext } from "../../context/channelContext";
import { ToastContext } from "../../context/toastContext";
import RoomUserService from "../../services/roomUserService";
import RoomUser from "../../models/room_user";

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
  const { setSelectedRoom, setSelectedRoomUser, rooms } = useContext(RoomContext);
  const { setSelectedChannel } = useContext(ChannelContext);
  const { addToast } = useContext(ToastContext);
  const { browseRooms, setBrowseRooms } = props;

  const selectRoom = (room: Room) => {
    RoomUserService.findAuthenticatedUser(room.uuid)
      .then((data: RoomUser) => {
        setSelectedRoomUser(data);
        setSelectedRoom(room);
        setBrowseRooms(false);
        setSelectedChannel(null);
      })
      .catch((err: unknown) => {
        if (err instanceof Error) addToast({ message: err.message, type: "error", duration: 5000 });
        else addToast({ message: "An unknown error occurred", type: "error", duration: 5000 });
      });
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
