import Button from "../../components/utils/Button";
import Restricted from "../../components/utils/Restricted";
import Spinner from "../../components/utils/Spinner";
import Alert from "../../components/utils/Alert";
import InputControlTracked from "../../components/utils/InputControlTracked";
import InputControl from "../../components/utils/InputControl";
import ChannelType from "../../models/channel_type";
import { v4 as uuidv4 } from "uuid";
import { useContext, useState, JSX, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContext } from "../../context/toastContext";
import { useGetChannelTypes } from "../../hooks/useChannelTypes";
import { useCreateChannel } from "../../hooks/useChannels";

/**
 * @function ChannelCreateView
 * @returns {JSX.Element}
 */
const ChannelCreateView = (): JSX.Element => {
    const { addToast } = useContext(ToastContext);
    const navigate = useNavigate();
    const getChannelTypes = useGetChannelTypes();
    const createChannel = useCreateChannel();
    const { room_uuid } = useParams<{ room_uuid: string }>();
    const [uuid, setUuid] = useState(uuidv4());
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [channelTypeName, setChannelTypeName] = useState('Text');
    const error = createChannel.error || getChannelTypes.error;
    const isLoading = createChannel.isLoading;
    const isLoadingTypes = getChannelTypes.isLoading;
    const channelTypes = getChannelTypes.data as ChannelType[];

    const create = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!room_uuid) return;

        if (name === '') {
            addToast({ message: 'Name is required', type: 'error', duration: 5000 });
            return;
        }

        if (description === '') {
            addToast({ message: 'Description is required', type: 'error', duration: 5000 });
            return;
        }

        if (channelTypeName === '') {
            addToast({ message: 'Type is required', type: 'error', duration: 5000 });
            return;
        }

        try {
            const formData = new FormData(e.currentTarget);
            await createChannel.mutateAsync(formData);
            navigate(`/room/${room_uuid}/channel/${uuid}`);
            addToast({ message: 'Channel created successfully', type: 'success', duration: 5000 });
        } catch (error) {
            addToast({ message: 'Error creating channel', type: 'error', duration: 5000 });
        }
    };

    const nameHandler = (e: FormEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setName(e.currentTarget.value);
    }

    const descriptionHandler = (e: FormEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setDescription(e.currentTarget.value);
    }

    const channelTypeHandler = (e: FormEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setChannelTypeName(e.currentTarget.value);
    }

    return (
        <Restricted slot={
            <div className="bg-black min-h-screen text-white">

                <div className="flex gap-3 justify-between p-3 border-b border-gray-800">
                    <div className="text-lg font-bold">
                        Delete Channel
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

                    {room_uuid && (
                        <div>
                            <Alert type="error" message={error} testId="channel-create-alert-message" />

                            <p className="text-md mb-3">
                                Enter the details to create a new channel.
                            </p>

                            <form onSubmit={create} data-testid="channel-create-form">
                                <input type="hidden" name="uuid" value={uuid} data-testid="channel-create-uuid" />
                                <input type="hidden" name="room_uuid" value={room_uuid} />

                                <InputControlTracked
                                    id="channel-create-name"
                                    label="Name"
                                    type="text"
                                    name="name"
                                    value={name}
                                    onChange={nameHandler}
                                />

                                <InputControlTracked
                                    id="channel-create-description"
                                    label="Description"
                                    type="text"
                                    name="description"
                                    value={description}
                                    onChange={descriptionHandler}
                                />

                                {isLoadingTypes && (
                                    <div className="flex gap-2 items-center">
                                        <Spinner isLoading={isLoadingTypes} width="2em" fill="white" />
                                        <p>Loading channel types</p>
                                    </div>
                                )}
                                {!isLoadingTypes && getChannelTypes && (
                                    <InputControlTracked
                                        id="channel-create-type"
                                        label="Type"
                                        type="select"
                                        name="channel_type_name"
                                        value={channelTypeName}
                                        options={channelTypes.map((type: ChannelType) => (
                                            <option key={type.name} value={type.name}>{type.name}</option>
                                        ))}
                                        onChange={channelTypeHandler}
                                    />
                                )}

                                <InputControl
                                    id="channel-create-file"
                                    type="file"
                                    label="Avatar"
                                    name="file"
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
                    )}
                </div>
            </div>
        } />
    );
};

export default ChannelCreateView;
