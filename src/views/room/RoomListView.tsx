import RoomListItem from "../../components/room/RoomListItem";
import Restricted from "../../components/utils/Restricted";
import Paginator from "../../components/utils/Paginator";
import Button from "../../components/utils/Button";
import Room from "../../models/room";
import { JSX } from "react";
import { useGetRooms } from "../../hooks/useRooms";
import { useNavigate } from 'react-router-dom';

/**
 * @function RoomList
 * @returns {JSX.Element}
 */
const RoomListView = (): JSX.Element => {
    const navigate = useNavigate();
    const { data, error, isLoading, page, pages, nextPage, previousPage } = useGetRooms();
    const rooms = data?.data || [];

    const selectRoom = (room: Room) => {
        navigate(`/room/${room.uuid}`);
    }

    return (
        <Restricted slot={
            <div className="bg-black min-h-screen text-white">

                <div className="flex gap-3 justify-between p-3 border-b border-gray-800">
                    <div className="text-lg font-bold">
                        Rooms
                    </div>

                    <div>
                        <Button
                            onClick={() => navigate('/')}
                            display="px-3 py-1 w-full block text-sm"
                            slot="Dashboard"
                            title="Dashboard"
                        />
                    </div>
                </div>

                <div className="p-3">
                
                    <Paginator nextPage={nextPage} previousPage={previousPage} isLoading={isLoading} error={error} page={page} pages={pages} slot={
                        <ul className="flex flex-col gap-3 mb-3" data-testid="room-list">
                            {rooms.map((room: Room) => (<RoomListItem key={room.uuid} room={room} setRoom={selectRoom} />))}
                            {!rooms.length && <li className="text-white" data-testid="room-list-empty">No rooms found</li>}
                        </ul>
                    } />
                </div>
            </div>
        } />
    );
};

export default RoomListView;
