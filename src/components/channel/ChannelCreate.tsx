import Button from "../utils/Button";
import Modal from "../utils/Modal";
import Spinner from "../utils/Spinner";
import Alert from "../utils/Alert";

import ChannelType from "../../models/channel_type";
import ChannelService from "../../services/channelService";
import useChannelTypes from "../../hooks/useChannelTypes";
import InputControlTracked from "../utils/InputControlTracked";

import { useContext, useState, ReactNode, FormEvent } from "react";
import { RoomContext } from "../../context/roomContext";
import { ChannelContext } from "../../context/channelContext";
import { v4 as uuidv4 } from "uuid";

/**
 * @interface ChannelCreateProps
 * @description The props for the ChannelCreate component
 */
interface ChannelCreateProps {
    showCreateChannel: boolean;
    setShowCreateChannel: (show: boolean) => void;
}

/**
 * @function ChannelCreate
 * @param {ChannelCreateProps} props
 * @returns {ReactNode}
 */
const ChannelCreate = (props: ChannelCreateProps): ReactNode => {
    const { showCreateChannel, setShowCreateChannel } = props;
    const { selectedRoom } = useContext(RoomContext);
    const { setChannels, channels } = useContext(ChannelContext);
    const { channelTypes } = useChannelTypes();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [channelTypeName, setChannelTypeName] = useState('');
    const [file, setFile] = useState('' as string | Blob);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('' as string);

    const create = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const formData = new FormData(e.currentTarget);
            formData.set('file', file);
            const response = await ChannelService.create(formData);
            setChannels([...channels, response]);
            setShowCreateChannel(false);
            setName('');
            setDescription('');
            setFile('');
            setError('');
            setChannelTypeName('');
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred');
            }
        } finally {
            setIsLoading(false);
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

    const fileHandler = (e: FormEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const target = e.target as HTMLInputElement;
        if (!target.files || !target.files.length) {
            setFile('');
            return;
        }
        setFile(target.files[0]);
    }

    return (
        <Modal title="Create Channel" show={showCreateChannel} setShow={setShowCreateChannel} slot={
            <div>
                {selectedRoom && (
                    <div>
                        <Alert type="error" message={error} />

                        <p className="text-md mb-3">
                            Enter the details to create a new channel.
                        </p>

                        <form onSubmit={create}>
                            <input type="hidden" name="uuid" value={uuidv4()} />
                            <input type="hidden" name="room_uuid" value={selectedRoom.uuid} />

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

                            <InputControlTracked
                                id="channel-create-file"
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
                )}
                {!selectedRoom && (
                    <p className="text-white">Select a room to create a channel</p>
                )}
            </div>
        } />
    );
};

export default ChannelCreate;
