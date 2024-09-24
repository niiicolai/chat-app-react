import ChannelService from "../../services/channelService";
import useChannelTypes from "../../hooks/useChannelTypes";
import InputControlTracked from "../utils/InputControlTracked";
import Button from "../utils/Button";
import Modal from "../utils/Modal";
import Spinner from "../utils/Spinner";
import Alert from "../utils/Alert";
import { v4 as uuidv4 } from "uuid";
import { useContext, useState } from "react";
import { RoomContext } from "../../context/roomContext";
import { ChannelContext } from "../../context/channelContext";

interface ChannelCreateProps {
    showCreateChannel: boolean;
    setShowCreateChannel: (show: boolean) => void;
}

const ChannelCreate = (props: ChannelCreateProps) => {
    const { showCreateChannel, setShowCreateChannel } = props;
    const { selectedRoom } = useContext(RoomContext);
    const { setChannels, channels } = useContext(ChannelContext);
    const { channelTypes } = useChannelTypes();
    const [ name, setName ] = useState('');
    const [ description, setDescription ] = useState('');
    const [ file, setFile ] = useState('' as any);

    const create = async (e: any) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        formData.set('file', file);
        const response = await ChannelService.create(formData);
        setChannels([...channels, response]);
        setShowCreateChannel(false);
        setName('');
        setDescription('');
        setFile('');
    };

    const fileHandler = (e: any) => {
        if (!e.target.files.length) {
            setFile('');
            return;
        }
        setFile(e.target.files[0]);
    }

    return (
        <Modal title="Create Channel" show={showCreateChannel} setShow={setShowCreateChannel} slot={
            <div>
                {selectedRoom && (
                    <div>
                        <p className="text-md mb-3">
                            Enter the details to create a new channel.
                        </p>

                        <form onSubmit={create}>
                            <input type="hidden" name="uuid" value={uuidv4()} />
                            <input type="hidden" name="room_uuid" value={selectedRoom.uuid} />

                            <InputControlTracked id="channel-create-name" label="Name" type="text" name="name" value={name} onChange={(e: any) => setName(e.target.value)} />
                            <InputControlTracked id="channel-create-description" label="Description" type="text" name="description" value={description} onChange={(e: any) => setDescription(e.target.value)} />
                            <InputControlTracked id="channel-create-type" label="Type" type="select" name="channel_type_name" options={channelTypes.map((type: any) => (
                                <option key={type.name} value={type.name}>{type.name}</option>
                            ))} />
                            <InputControlTracked id="channel-create-file" type="file" label="Avatar" name="file" value={file} onChange={(e: any) => fileHandler(e)} />
                            
                            <div className="flex flex-col gap-2">
                                <Button type="primary" button="submit" slot="Create" />
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
