import useRooms from "../../hooks/useRooms";

const RoomShow = (props: any) => {
    const { destroy } = useRooms();
    const room = props.room;
    return (
        <>
            {room && (
                <div>
                    <h1>{room.name}</h1>
                    <p>{room.description}</p>
                    <p>{room.room_category_name}</p>

                    {room.avatar_src && (
                        <img src={room.avatar_src} alt={room.name} />
                    )}

                    <button onClick={() => destroy(room.uuid)}>Delete</button>
                </div>
            )}
            {!room && <p>No room selected! {room}</p>}
        </>
    );
};

export default RoomShow;
