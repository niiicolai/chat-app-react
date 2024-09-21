import useRooms from "../../hooks/useRooms";
import useRoomCategories from "../../hooks/useRoomCategories";
import InputControl from "../utils/InputControl";
import Button from "../utils/Button";
import Modal from "../utils/Modal";
import { v4 as uuidv4 } from "uuid";

const RoomCreate = (props: any) => {
    const { createRoom, setCreateRoom } = props;
    const { categories } = useRoomCategories();
    const { error, isLoading, create } = useRooms();
    return (
        <Modal title="Create Room" show={createRoom} setShow={setCreateRoom} slot={
            <div>
                <p className="text-md mb-3">
                    Enter the details to create a room
                </p>

                {error && <p className="text-danger">{error}</p>}
                {isLoading && <div className="spinner-border"></div>}

                <form onSubmit={create}>
                    <input type="hidden" name="uuid" value={uuidv4()} />
                    <InputControl id="name" type="text" label="Name" name="name" />
                    <InputControl id="description" type="text" label="Desc" name="description" />
                    <InputControl id="room_category_name" name="room_category_name" type="select" label="Category" options={categories.map((category) => (
                        <option key={category.name} value={category.name}>{category.name}</option>
                    ))} />
                    <InputControl id="file" type="file" label="Avatar" name="file" />

                    <div className="flex flex-col gap-2">
                        <Button type="primary" button="submit" slot="Create" />
                    </div>
                </form>
            </div>
        } />
    );
};

export default RoomCreate;
