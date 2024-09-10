import useRooms from "../../hooks/useRooms";
import useRoom from "../../hooks/useRoom";
import RoomShow from "./RoomShow";
import RoomUpdate from "./RoomUpdate";

const RoomList = () => {
  const { room, setRoom } = useRoom();
  const { rooms, error, isLoading } = useRooms();
  return (
    <>
      {error && <p className="text-danger">{error}</p>}
      {isLoading && <div className="spinner-border"></div>}
      <RoomShow room={room} />
      <RoomUpdate room={room} />

      <ul>
        {rooms.map((room) => (
          <li
            key={room.uuid}
          >
            <button onClick={() => setRoom(room)}
              style={{ 
                backgroundImage: room.avatar_src ? `url(${room.avatar_src})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat', 
              }}
            >
              {room.name}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default RoomList;