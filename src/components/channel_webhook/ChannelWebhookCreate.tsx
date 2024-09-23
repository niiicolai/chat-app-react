import InputControlTracked from "../utils/InputControlTracked";
import Button from "../utils/Button";
import Modal from "../utils/Modal";
import { useContext } from "react";
import { ChannelContext } from "../../context/channelContext";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface ChannelWebhookCreateProps {
    showWebhookCreate: boolean;
    setShowWebhookCreate: (show: boolean) => void;
    create: (e: any, file: any) => Promise<void>;
}

const ChannelWebhookCreate = (props: ChannelWebhookCreateProps) => {
    const { channels } = useContext(ChannelContext);
    const { showWebhookCreate, setShowWebhookCreate, create } = props;
    const [ uuid, setUuid ] = useState(uuidv4());
    const [ name, setName ] = useState('');
    const [ description, setDescription ] = useState('');
    const [ channelUuid, setChannelUuid ] = useState('');
    const [ file, setFile ] = useState('' as any);

    const createHandler = (e: any) => {
        create(e, file).then(() => {
            setUuid(uuidv4());
            setName('');
            setDescription('');
            setChannelUuid('');
            setFile('');
        });
    }

    const fileHandler = (e: any) => {
        if (!e.target.files.length) {
            setFile('');
            return;
        }
        setFile(e.target.files[0]);
    }

    return (
        <Modal title="Create Channel Webhook" show={showWebhookCreate} setShow={setShowWebhookCreate} slot={
            <div>
                <p className="text-md mb-3">
                    Enter the details to create a new channel webhook.  
                </p>

                <form onSubmit={createHandler}>
                    <input type="hidden" name="uuid" value={uuid} />
                    <InputControlTracked id="webhook-create-name" type="text" label="Name" name="name" value={name} onChange={(e: any) => setName(e.target.value)} />
                    <InputControlTracked id="webhook-create-description" type="text" label="Desc" name="description" value={description} onChange={(e: any) => setDescription(e.target.value)} />
                    
                    <InputControlTracked id="webhook-create-channel-uuid" name="channel_uuid" type="select" label="Channel" value={channelUuid} onChange={(e: any) => setChannelUuid(e.target.value)} 
                        options={channels.map((channel) => (
                            <option key={channel.uuid} value={channel.uuid}>{channel.name}</option>
                        ))}
                    />
                    <InputControlTracked id="webhook-create-file" type="file" label="Avatar" name="file" value={file} onChange={(e: any) => fileHandler(e)} />

                    <div className="flex flex-col gap-2">
                        <Button type="primary" button="submit" slot="Create" />
                    </div>
                </form>
            </div>
        } />
    );
};

export default ChannelWebhookCreate;
