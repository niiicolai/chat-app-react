import InputControl from "../utils/InputControl";
import InputControlTracked from "../utils/InputControlTracked";
import Button from "../utils/Button";
import Modal from "../utils/Modal";
import Channel from "../../models/channel";
import ChannelService from "../../services/channelService";
import { useContext, useState } from "react";
import { ChannelContext } from "../../context/channelContext";

interface ChannelUpdateProps {
    editChannel: Channel | null;
    setEditChannel: (channel: Channel | null) => void;
}

const ChannelUpdate = (props: ChannelUpdateProps) => {
    const { editChannel, setEditChannel } = props;
    const { selectedChannel, setChannels, channels, setSelectedChannel } = useContext(ChannelContext);
    const [ file, setFile ] = useState('' as any);

    const update = async (e: any) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const uuid = formData.get('uuid') as string;
        formData.set('file', file);
        if (!uuid) return;
        const response = await ChannelService.update(uuid, formData);
        const updatedChannels = channels.map((channel: any) => {
            if (channel.uuid === response.uuid) {
                return response;
            }
            return channel;
        });
        setChannels(updatedChannels);
        if (selectedChannel?.uuid === response.uuid) {
            setSelectedChannel(response);
        }
        setEditChannel(null);
        setFile(editChannel?.room_file?.src || '');
    };

    const fileHandler = (e: any) => {
        if (!e.target.files.length) {
            setFile(editChannel?.room_file?.src || '');
            return;
        }
        setFile(e.target.files[0]);
    }

    return (
        <Modal title="Update Channel" show={editChannel} setShow={(s:any)=>setEditChannel(null)} slot={
            <div>
                <div>
                    <p className="text-md mb-3">
                        Enter the details to update the channel.
                    </p>

                    <form onSubmit={update}>
                        <input type="hidden" name="uuid" value={editChannel?.uuid ||''} />

                        <InputControl id="channel-update-name" label="Name" type="text" name="name" defaultValue={editChannel?.name ||''} />
                        <InputControl id="channel-update-description" label="Description" type="text" name="description" defaultValue={editChannel?.description ||''} />
                        <InputControlTracked id="channel-update-file" type="file" label="Avatar" name="file" value={editChannel?.room_file?.src ||''} onChange={(e: any) => fileHandler(e)} />
                        <div className="flex flex-col gap-2">
                            <Button type="primary" button="submit" slot="Update" />
                        </div>
                    </form>
                </div>
            </div>
        } />
    );
};

export default ChannelUpdate;
