import { useContext, useState, JSX } from "react";
import { RoomContext } from "../../context/roomContext";
import { ChannelContext } from "../../context/channelContext";
import { ToastContext } from "../../context/toastContext";
import Modal from "../utils/Modal";
import RoomListItem from "./RoomListItem";
import Room from "../../models/room";
import RoomUserService from "../../services/roomUserService";
import RoomUser from "../../models/room_user";
import RoomService from "../../services/roomService";
import Paginator from "../utils/Paginator";

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
  const { setSelectedRoom, setSelectedRoomUser, rooms, setPages, pages, setRooms } = useContext(RoomContext);
  const { setSelectedChannel } = useContext(ChannelContext);
  const { addToast } = useContext(ToastContext);
  const { browseRooms, setBrowseRooms } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

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

  const paginate = (page: number, limit: number) => {
    setIsLoading(true);

    RoomService.findAll(page, limit)
      .then(({ data: rooms, pages }: { data: Room[], pages: number }) => {
        setRooms(rooms);
        setPages(pages);
        setError("");
      })
      .catch((err: unknown) => {
        if (err instanceof Error) setError(err.message);
        else setError("An unknown error occurred");
      })
      .finally(() => setIsLoading(false));
  }

  const previousPage = () => {
    if (pages <= 1) return;
    if (page === 1) return;
    setPage(page - 1);
    paginate(page - 1, limit);
  }

  const nextPage = () => {
    if (page === pages) return;
    setPage(page + 1);
    paginate(page + 1, limit);
  }

  return (
    <Modal title="Rooms" show={browseRooms} setShow={setBrowseRooms} slot={
      <div>
        <Paginator nextPage={nextPage} previousPage={previousPage} isLoading={isLoading} error={error} page={page} pages={pages} slot={
          <ul className="flex flex-col gap-3 mb-3">
            {rooms.map((room) => (<RoomListItem key={room.uuid} room={room} setRoom={selectRoom} />))}
            {!rooms.length && <li className="text-white">No rooms found</li>}
          </ul>
        } />
      </div>
    } />
  );
};

export default RoomList;
