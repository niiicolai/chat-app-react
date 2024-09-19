import useRooms from "../../hooks/useRooms";
import useRoomCategories from "../../hooks/useRoomCategories";
import InputControl from "../utils/InputControl";
import Button from "../utils/Button";

const RoomUpdate = (props: any) => {
    const { room, setEditRoom } = props;
    const { categories } = useRoomCategories();
    const { error, isLoading, update } = useRooms();
    return (
        <div className="absolute top-0 left-0 right-0 p-3 bg-black min-h-screen z-40">
            <h1 className="text-lg font-bold">
                Update Room
            </h1>

            <p className="text-md mb-3">
                Enter the details to update a room
            </p>

            {error && <p className="text-danger">{error}</p>}
            {isLoading && <div className="spinner-border"></div>}
            {room && (
                <form onSubmit={update} className="text-white">
                    <input type="hidden" name="uuid" value={room.uuid} />
                    <InputControl id="name" type="text" label="Name" name="name" defaultValue={room.name} />
                    <InputControl id="description" type="text" label="Desc" name="description" defaultValue={room.description} />
                    <InputControl 
                        id="room_category_name" 
                        name="room_category_name"
                        type="select" 
                        label="Category" 
                        defaultValue={room.room_category_name} 
                        options={
                            categories.map((category) => (
                                <option key={category.name} value={category.name}>
                                    {category.name}
                                </option>
                            ))
                        }
                    />
                    <InputControl id="file" type="file" label="Avatar" name="file" defaultValue={room.avatar?.room_file?.src} />
                    
                    <div className="flex flex-col gap-2">
                        <Button type="primary" button="submit" slot="Update" />
                        <Button type="secondary" button="button" slot="Cancel" onClick={() => setEditRoom(null)} />
                    </div>
                </form>
            )}
        </div>
    );
};

export default RoomUpdate;
