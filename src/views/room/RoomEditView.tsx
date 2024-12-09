import InputControl from "../../components/utils/InputControl";
import Button from "../../components/utils/Button";
import Spinner from "../../components/utils/Spinner";
import Alert from "../../components/utils/Alert";
import Restricted from "../../components/utils/Restricted";
import InputControlTracked from "../../components/utils/InputControlTracked";
import { useGetRoom, useUpdateRoom, useDestroyAvatar } from "../../hooks/useRooms";
import { useGetRoomCategories } from "../../hooks/useRoomCategories";
import { useParams, useNavigate } from "react-router-dom";
import { FormEvent, JSX, useContext } from "react";
import { ToastContext } from "../../context/toastContext";

/**
 * @function RoomEditView
 * @returns {JSX.Element}
 */
const RoomEditView = (): JSX.Element => {
    const navigate = useNavigate();
    const { addToast } = useContext(ToastContext);
    const { room_uuid } = useParams<{ room_uuid: string }>();
    const getRoom = useGetRoom(room_uuid as string);
    const updateRoom = useUpdateRoom(room_uuid as string);
    const destroyAvatar = useDestroyAvatar(room_uuid as string);
    const getCategories = useGetRoomCategories();
    const { category, setCategory } = getRoom;
    const { data: room, isLoading: isLoadingRoom } = getRoom.query;
    const { data: categories, isLoading: isLoadingCat } = getCategories;
    const error = getRoom.query.error || getCategories.error || updateRoom.error || destroyAvatar.error;
    const isLoading = updateRoom.isLoading || destroyAvatar.isLoading;

    const updateRoomHandler = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!room_uuid) return;

        const formData = new FormData(event.currentTarget);

        if (formData.get("name") === "") {
            addToast({ message: 'Name is required', type: 'error', duration: 5000 });
            return;
        }

        if (formData.get("description") === "") {
            addToast({ message: 'Description is required', type: 'error', duration: 5000 });
            return;
        }

        try {
            await updateRoom.mutateAsync({ uuid: room_uuid, formData });
            navigate(`/room/${room_uuid}`);
            addToast({ message: 'Room updated successfully', type: 'success', duration: 5000 });
        } catch (error) {
            addToast({ message: 'Error updating room', type: 'error', duration: 5000 });
        }
    }

    const destroyAvatarHandler = async () => {
        if (!room?.avatar?.room_file) return;

        try {
            await destroyAvatar.mutateAsync(room.avatar.room_file.uuid);
            addToast({ message: 'Avatar removed', type: 'success', duration: 5000 });
        } catch (error) {
            addToast({ message: 'Error removing avatar', type: 'error', duration: 5000 });
        }
    }

    const categoryHandler = (e: FormEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const target = e.target as HTMLSelectElement;
        setCategory(target.value);
    }

    return (
        <Restricted slot={
            <div className="bg-black min-h-screen text-white">

                <div className="flex gap-3 justify-between p-3 border-b border-gray-800">
                    <div className="text-lg font-bold">
                        Edit Room
                    </div>

                    <div>
                        <Button
                            onClick={() => navigate(`/room/${room_uuid}`)}
                            display="px-3 py-1 w-full block text-sm"
                            slot="Back to Room"
                            title="Back to Room"
                        />
                    </div>
                </div>

                <div className="p-3">
                    <Alert type="error" message={error} testId="room-edit-alert-message" />


                    {!room && isLoadingRoom && (
                        <div className="text-center">
                            <Spinner isLoading={isLoadingRoom} width="2em" fill="white" />
                            <p>Loading room...</p>
                        </div>
                    )}
                    {room && !isLoadingRoom && (
                        <>
                            <p className="text-md mb-3">
                                Enter the details to update a room
                            </p>

                            <form onSubmit={updateRoomHandler} className="text-white" data-testid="room-edit-form">
                                <InputControl
                                    id="room-update-name"
                                    type="text"
                                    label="Name"
                                    name="name"
                                    defaultValue={room.name}
                                />

                                <InputControl
                                    id="room-update-description"
                                    type="text"
                                    label="Desc"
                                    name="description"
                                    defaultValue={room.description}
                                />

                                {isLoadingCat && (
                                    <div>
                                        <Spinner isLoading={isLoadingCat} width="2em" fill="white" />
                                        <p>Loading categories...</p>
                                    </div>
                                )}
                                {categories && !isLoadingCat && (
                                    <InputControlTracked
                                        id="room-update-room_category_name"
                                        name="room_category_name"
                                        type="select"
                                        label="Category"
                                        value={category}
                                        onChange={categoryHandler}
                                        options={
                                            categories.map((category) => (
                                                <option key={category.name} value={category.name}>
                                                    {category.name}
                                                </option>
                                            ))
                                        }
                                    />
                                )}

                                <InputControlTracked
                                    id="room-update-file"
                                    type="file"
                                    label="Avatar"
                                    name="file"
                                    value={room.avatar?.room_file?.src as string}
                                    onChange={() => { }}
                                    footerSlot={
                                        <div>
                                            {room.avatar?.room_file &&
                                                <div className="p-3">
                                                    <Button
                                                        type="error"
                                                        onClick={() => destroyAvatarHandler()}
                                                        button="button"
                                                        slot="Delete Avatar"
                                                    />
                                                </div>
                                            }
                                        </div>
                                    }
                                />

                                <div className="flex flex-col gap-2">
                                    {
                                        isLoading
                                            ? <Spinner isLoading={isLoading} width="2em" fill="white" />
                                            : (<>
                                                <Button type="primary" button="submit" slot="Update" />
                                                <Button
                                                    type="secondary"
                                                    button="button"
                                                    slot="Cancel"
                                                    onClick={() => { navigate(`/room/${room_uuid}`) }}
                                                />
                                            </>)
                                    }
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </div>
        } />
    );
};

export default RoomEditView;
