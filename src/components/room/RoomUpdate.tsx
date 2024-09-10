import useRooms from "../../hooks/useRooms";
import useRoomCategories from "../../hooks/useRoomCategories";

const RoomUpdate = (props: any) => {
    const { categories } = useRoomCategories();
    const { error, isLoading, update } = useRooms();
    const room = props.room
    return (
        <>
            <h1>
                Update Room
            </h1>

            <p>
                Enter the details to update a room
            </p>

            {error && <p className="text-danger">{error}</p>}
            {isLoading && <div className="spinner-border"></div>}

            {room && (
                <form onSubmit={update}>

                    <input type="hidden" name="uuid" value={room.uuid} />
                    <input type="text" name="name" placeholder="Name" defaultValue={room.name} />
                    <input type="text" name="description" placeholder="Description" defaultValue={room.description} />

                    <label>Room Category</label>
                    <select name="room_category_name" id="room_category_name" defaultValue={room.room_category_name}>
                        {categories.map((category) => (
                            <option key={category.name} value={category.name}>
                                {category.name}
                            </option>
                        ))}
                    </select>

                    <label>Avatar</label>
                    <input type="file" name="file" />
                    {room.avatar_src && <img src={room.avatar_src} alt={room.name} />}

                    <button type="submit">Update</button>
                </form>
            )}

            {!room && <p>No room selected! {room}</p>}
        </>
    );
};

export default RoomUpdate;
