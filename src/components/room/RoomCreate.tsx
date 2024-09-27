import useRoomCategories from "../../hooks/useRoomCategories";
import InputControlTracked from "../utils/InputControlTracked";
import RoomService from "../../services/roomService";
import Button from "../utils/Button";
import Modal from "../utils/Modal";
import Spinner from "../utils/Spinner";
import Alert from "../utils/Alert";
import { v4 as uuidv4 } from "uuid";
import { useState, useContext, ReactNode, FormEvent } from "react";
import { RoomContext } from "../../context/roomContext";
import { ToastContext } from "../../context/toastContext";

/**
 * @interface RoomCreateProps
 * @description The props for the RoomCreate component
 */
interface RoomCreateProps {
    showCreateRoom: boolean;
    setShowCreateRoom: (show: boolean) => void;
}

/**
 * @function RoomCreate
 * @param {RoomCreateProps} props
 * @returns {ReactNode}
 */
const RoomCreate = (props: RoomCreateProps): ReactNode => {
    const { addToast } = useContext(ToastContext);
    const { rooms, setRooms, setSelectedRoom } = useContext(RoomContext);
    const { showCreateRoom, setShowCreateRoom } = props;
    const { categories } = useRoomCategories();
    const [uuid, setUuid] = useState(uuidv4());
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [room_category_name, setRoomCategoryName] = useState("");
    const [file, setFile] = useState('' as string | Blob);
    const [error, setError] = useState('' as string);
    const [isLoading, setIsLoading] = useState(false);

    const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
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
            setError('');
            setShowCreateRoom(false);
            setSelectedRoom(room);
            addToast({ message: 'Room created', type: 'success', duration: 5000 });
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred");
            }
        } finally {
            setIsLoading(false);
        }
    }

    const nameHandler = (e: FormEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setName(e.currentTarget.value);
    }

    const descriptionHandler = (e: FormEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setDescription(e.currentTarget.value);
    }

    const roomCategoryNameHandler = (e: FormEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setRoomCategoryName(e.currentTarget.value);
    }

    const fileHandler = (e: FormEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const target = e.target as HTMLInputElement;
        if (!target.files || !target.files.length) {
            setFile('');
            return;
        }
        setFile(target.files[0]);
    }

    return (
        <Modal title="Create Room" show={showCreateRoom} setShow={setShowCreateRoom} slot={
            <div>
                <Alert type="error" message={error} />

                <p className="text-md mb-3">
                    Enter the details to create a room
                </p>


                <form onSubmit={submitHandler}>
                    <input type="hidden" name="uuid" value={uuid} />
                    <InputControlTracked id="room-create-name" type="text" label="Name" name="name" value={name} onChange={nameHandler} />
                    <InputControlTracked id="room-create-description" type="text" label="Desc" name="description" value={description} onChange={descriptionHandler} />
                    <InputControlTracked id="room-create-room_category_name" name="room_category_name" type="select" label="Category" value={room_category_name} onChange={roomCategoryNameHandler}
                        options={categories.map((category) => (
                            <option key={category.name} value={category.name}>{category.name}</option>
                        ))}
                    />
                    <InputControlTracked 
                        id="room-create-file" 
                        type="file" 
                        label="Avatar" 
                        name="file" 
                        value={file ? (file as File).name : ''} 
                        onChange={fileHandler} 
                    />

                    <div className="flex flex-col gap-2">
                        <Button type="primary" button="submit" slot={
                            <span>
                                {isLoading
                                    ? <Spinner isLoading={isLoading} width="2em" fill="white" />
                                    : "Create"
                                }
                            </span>
                        } />
                    </div>
                </form>
            </div>
        } />
    );
};

export default RoomCreate;
