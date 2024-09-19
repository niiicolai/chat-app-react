import React, { useState } from "react";
import useRooms from "../../hooks/useRooms";
import useRoom from "../../hooks/useRoom";
import RoomCreate from "./RoomCreate";
import RoomUpdate from "./RoomUpdate";
import RoomShow from "./RoomShow";
import Button from "../utils/Button";
import Spinner from "../utils/Spinner";
import Alert from "../utils/Alert";
import type Room from "../../models/room";

const RoomList = () => {
  const { room, setRoom } = useRoom();
  const { rooms, error, isLoading } = useRooms();
  const [ createRoom, setCreateRoom ] = useState(false);
  const [ editRoom, setEditRoom ] = useState(null);

  const li = (room: Room) => {
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
              }}/>
              <span className="absolute left-0 right-0 top-0 bottom-0 bg-black/20 z-20"/>
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
  }
  
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
            {rooms.map((room) => (li(room)))}
            {!rooms.length && <li className="text-white">No rooms found</li>}
          </ul>

          <RoomShow room={room} setEditRoom={setEditRoom} />
        </div>
      }
    </div>
  );
};

export default RoomList;
