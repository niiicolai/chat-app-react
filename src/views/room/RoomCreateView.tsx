import InputControlTracked from "../../components/utils/InputControlTracked";
import Restricted from "../../components/utils/Restricted";
import Button from "../../components/utils/Button";
import Spinner from "../../components/utils/Spinner";
import Alert from "../../components/utils/Alert";
import { v4 as uuidv4 } from "uuid";
import { useGetRoomCategories } from "../../hooks/useRoomCategories";
import { useCreateRoom } from "../../hooks/useRooms";
import { useState, useContext, JSX, FormEvent } from "react";
import { ToastContext } from "../../context/toastContext";
import { useNavigate } from 'react-router-dom';
import InputControl from "../../components/utils/InputControl";

/**
 * @function RoomCreate
 * @returns {JSX.Element}
 */
const RoomCreateView = (): JSX.Element => {
    const navigate = useNavigate();
    const { addToast } = useContext(ToastContext);
    const { data: categories, isLoading: isLoadingCat } = useGetRoomCategories();
    const { mutateAsync, isLoading, error } = useCreateRoom();
    const [uuid] = useState(uuidv4());
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [room_category_name, setRoomCategoryName] = useState("");

    const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        if (name === "") {
            addToast({ message: 'Name is required', type: 'error', duration: 5000 });
            return;
        }

        if (description === "") {
            addToast({ message: 'Description is required', type: 'error', duration: 5000 });
            return;
        }

        if (room_category_name === "") {
            addToast({ message: 'Category is required', type: 'error', duration: 5000 });
            return;
        }

        await mutateAsync(formData);
        navigate(`/room/${uuid}`);
        addToast({ message: 'Room created successfully', type: 'success', duration: 5000 });
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

    return (
        <Restricted slot={
            <div className="bg-black min-h-screen text-white">

                <div className="flex gap-3 justify-between p-3 border-b border-gray-800">
                    <div className="text-lg font-bold">
                        Create Room
                    </div>

                    <div>
                        <Button
                            onClick={() => navigate('/')}
                            display="px-3 py-1 w-full block text-sm"
                            slot="Dashboard"
                            title="Dashboard"
                        />
                    </div>
                </div>

                <div className="p-3">
                    <Alert type="error" message={error} testId="room-create-alert-message" />

                    <p className="text-md mb-3">
                        Enter the details to create a room
                    </p>


                    <form onSubmit={submitHandler} data-testid="room-create-form">
                        <input type="hidden" name="uuid" value={uuid} />
                        <InputControlTracked id="room-create-name" type="text" label="Name" name="name" value={name} onChange={nameHandler} />
                        <InputControlTracked id="room-create-description" type="text" label="Desc" name="description" value={description} onChange={descriptionHandler} />

                        {isLoadingCat && (
                            <div>
                                <Spinner isLoading={isLoadingCat} width="2em" fill="white" />
                                <p>Loading categories...</p>
                            </div>
                        )}
                        {categories && !isLoadingCat && (
                            <InputControlTracked
                                id="room-create-room_category_name"
                                name="room_category_name"
                                type="select"
                                label="Category"
                                value={room_category_name}
                                onChange={roomCategoryNameHandler}
                                options={
                                    categories.map((category) => (
                                        <option key={category.name} value={category.name}>
                                            {category.name}
                                        </option>
                                    ))
                                }
                            />
                        )}

                        <InputControl
                            id="room-create-file"
                            type="file"
                            label="Avatar"
                            name="file"
                        />

                        <div className="flex flex-col gap-2">
                            {
                                isLoading
                                    ? <Spinner isLoading={isLoading} width="2em" fill="white" />
                                    : (<>
                                        <Button type="primary" button="submit" slot="Create" />
                                        <Button
                                            type="secondary"
                                            button="button"
                                            slot="Cancel"
                                            onClick={() => { navigate('/') }}
                                        />
                                    </>)
                            }
                        </div>
                    </form>
                </div>
            </div>
        } />
    );
};

export default RoomCreateView;
