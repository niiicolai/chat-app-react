import useRooms from "../../hooks/useRooms";
import useRoomCategories from "../../hooks/useRoomCategories";
import InputControl from "../utils/InputControl";
import Button from "../utils/Button";
import Modal from "../utils/Modal";

const RoomUpdate = (props: any) => {
    const { editRoom, setEditRoom } = props;
    const { categories } = useRoomCategories();
    const { error, isLoading, update } = useRooms();

    return (
        <Modal title="Update Room" show={editRoom} setShow={setEditRoom} slot={
            <div>

                <p className="text-md mb-3">
                    Enter the details to update a room
                </p>

                {error && <p className="text-danger">{error}</p>}
                {isLoading && <div className="spinner-border"></div>}
                {editRoom && (
                    <form onSubmit={update} className="text-white">
                        <input type="hidden" name="uuid" value={editRoom.uuid} />
                        <InputControl id="name" type="text" label="Name" name="name" defaultValue={editRoom.name} />
                        <InputControl id="description" type="text" label="Desc" name="description" defaultValue={editRoom.description} />
                        <InputControl 
                            id="room_category_name" 
                            name="room_category_name"
                            type="select" 
                            label="Category" 
                            defaultValue={editRoom.room_category_name} 
                            options={
                                categories.map((category) => (
                                    <option key={category.name} value={category.name}>
                                        {category.name}
                                    </option>
                                ))
                            }
                        />
                        <InputControl id="file" type="file" label="Avatar" name="file" defaultValue={editRoom.avatar?.room_file?.src} />
                        
                        <div className="flex flex-col gap-2">
                            <Button type="primary" button="submit" slot="Update" />
                            <Button type="secondary" button="button" slot="Cancel" onClick={() => setEditRoom(null)} />
                        </div>
                    </form>
                )}
            </div>
        } />
    );
};

export default RoomUpdate;
