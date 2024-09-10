import useRooms from "../../hooks/useRooms";
import useRoomCategories from "../../hooks/useRoomCategories";
import { v4 as uuidv4 } from "uuid";

const RoomCreate = () => {
    const { categories } = useRoomCategories();
    const { error, isLoading, create } = useRooms();
    return (
        <>
            <h1>
                Create Room
            </h1>

            <p>
                Enter the details to create a room
            </p>

            {error && <p className="text-danger">{error}</p>}
            {isLoading && <div className="spinner-border"></div>}

            <form onSubmit={create}>
                <input type="hidden" name="uuid" value={uuidv4()} />
                <input type="text" name="name" placeholder="Name" />
                <input type="text" name="description" placeholder="Description" />

                <label>Room Category</label>
                <select name="room_category_name" id="room_category_name">
                    {categories.map((category) => (
                        <option key={category.name} value={category.name}>{category.name}</option>
                    ))}
                </select>

                <label>Avatar</label>
                <input type="file" name="file" />

                <button type="submit">Create</button>
            </form>
        </>
    );
};

export default RoomCreate;
