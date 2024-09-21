import useChannels from "../../hooks/useChannels";
import useChannelTypes from "../../hooks/useChannelTypes";
import InputControl from "../utils/InputControl";
import Button from "../utils/Button";
import Modal from "../utils/Modal";
import Spinner from "../utils/Spinner";
import Alert from "../utils/Alert";
import { v4 as uuidv4 } from "uuid";
import { useContext } from "react";
import { RoomContext } from "../../context/roomContext";

const ChannelCreate = (props: any) => {
    const { createChannel, setCreateChannel } = props;
    const { room } = useContext(RoomContext);
    const { channelTypes } = useChannelTypes();
    const { error, isLoading, create } = useChannels();
    return (
        <Modal title="Create Channel" show={createChannel} setShow={setCreateChannel} slot={
            <div>
                {room && (
                    <div>
                        <p className="text-md mb-3">
                            Enter the details to create a new channel.
                        </p>

                        <Alert message={error} type="error" />
                        <Spinner isLoading={isLoading} fill="white" width="16" />

                        <form onSubmit={create}>
                            <input type="hidden" name="uuid" value={uuidv4()} />
                            <input type="hidden" name="room_uuid" value={room.uuid} />

                            <InputControl id="channel-create-name" label="Name" type="text" name="name" />
                            <InputControl id="channel-create-description" label="Description" type="text" name="description" />
                            <InputControl id="channel-create-type" label="Type" type="select" name="channel_type_name" options={channelTypes.map((type: any) => (
                                <option key={type.name} value={type.name}>{type.name}</option>
                            ))} />
                            <InputControl id="file" type="file" label="Avatar" name="file" />
                            <div className="flex flex-col gap-2">
                                <Button type="primary" button="submit" slot="Create" />
                            </div>
                        </form>
                    </div>
                )}
                {!room && (
                    <p className="text-white">Select a room to create a channel</p>
                )}
            </div>
        } />
    );
};

export default ChannelCreate;
