import React, { useState } from "react";
import useRooms from "../../hooks/useRooms";
import useRoom from "../../hooks/useRoom";
import RoomCreate from "./RoomCreate";
import RoomUpdate from "./RoomUpdate";
import RoomShow from "./RoomShow";
import Button from "../utils/Button";
import Spinner from "../utils/Spinner";
import Alert from "../utils/Alert";
import RoomListItem from "./RoomListItem";

const RoomList = () => {
  const { room, setRoom } = useRoom();
  const { rooms, error, isLoading } = useRooms();
  const [ createRoom, setCreateRoom ] = useState(false);
  const [ editRoom, setEditRoom ] = useState(null);
  
  return (
    <div className="bg-black p-3">
      {createRoom && <RoomCreate setCreateRoom={setCreateRoom} />}
      {editRoom && <RoomUpdate room={editRoom} setEditRoom={setEditRoom} />}

      {error && <Alert message={error} type="error" />}
      
      {isLoading && 
        <div className="flex flex-col items-center justify-center gap-3 p-3">
          <h1 className="text-white">Loading rooms...</h1>
          <Spinner isLoading={isLoading} fill="white" width="16" />
        </div>
      }
      
      {!isLoading && 
        <div>
          <ul className="flex flex-col gap-3 border-b border-gray-800 pb-3">
            <li>
              <Button onClick={() => setCreateRoom(true)}
                display="w-full p-3 font-bold"
                button="button"
                type="primary"
                slot="Create Room"
              />
            </li>
            {rooms.map((room) => (<RoomListItem key={room.uuid} room={room} setRoom={setRoom} />))}
            {!rooms.length && <li className="text-white">No rooms found</li>}
          </ul>

          <RoomShow room={room} setEditRoom={setEditRoom} />
        </div>
      }
    </div>
  );
};

export default RoomList;
