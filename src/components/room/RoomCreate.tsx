import useRoomCategories from "../../hooks/useRoomCategories";
import InputControlTracked from "../utils/InputControlTracked";
import RoomService from "../../services/roomService";
import Button from "../utils/Button";
import Modal from "../utils/Modal";
import { v4 as uuidv4 } from "uuid";
import { useState, useContext } from "react";
import { RoomContext } from "../../context/roomContext";

interface RoomCreateProps {
    showCreateRoom: boolean;
    setShowCreateRoom: (show: boolean) => void;
}

const RoomCreate = (props: RoomCreateProps) => {
    const { rooms, setRooms, setSelectedRoom } = useContext(RoomContext);
    const { showCreateRoom, setShowCreateRoom } = props;
    const { categories } = useRoomCategories();
    const [ uuid, setUuid ] = useState(uuidv4());
    const [ name, setName ] = useState("");
    const [ description, setDescription ] = useState("");
    const [ room_category_name, setRoomCategoryName ] = useState("");
    const [ file, setFile ] = useState('' as any);

    const submitHandler = async (event: any) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        formData.set('file', file);
        try {
            const room = await RoomService.create(formData);
            setRooms([...rooms, room]);
            setUuid(uuidv4());
            setName("");
            setDescription("");
            setRoomCategoryName("");
            setFile('');
            setShowCreateRoom(false);
            setSelectedRoom(room);
        } catch (err: any) {
            console.error(err);
        }
    }

    const fileHandler = (e: any) => {
        if (!e.target.files.length) {
            setFile('');
            return;
        }
        setFile(e.target.files[0]);
    }

    return (
        <Modal title="Create Room" show={showCreateRoom} setShow={setShowCreateRoom} slot={
            <div>
                <p className="text-md mb-3">
                    Enter the details to create a room
                </p>


                <form onSubmit={submitHandler}>
                    <input type="hidden" name="uuid" value={uuid} />
                    <InputControlTracked id="room-create-name" type="text" label="Name" name="name" value={name} onChange={(e: any) => setName(e.target.value)} />
                    <InputControlTracked id="room-create-description" type="text" label="Desc" name="description" value={description} onChange={(e: any) => setDescription(e.target.value)} />
                    <InputControlTracked id="room-create-room_category_name" name="room_category_name" type="select" label="Category" value={room_category_name} onChange={(e: any) => setRoomCategoryName(e.target.value)}
                        options={categories.map((category) => (
                        <option key={category.name} value={category.name}>{category.name}</option>
                        ))} 
                    />
                    <InputControlTracked id="room-create-file" type="file" label="Avatar" name="file" value={file} onChange={(e: any) => fileHandler(e)} />

                    <div className="flex flex-col gap-2">
                        <Button type="primary" button="submit" slot="Create" />
                    </div>
                </form>
            </div>
        } />
    );
};

export default RoomCreate;
