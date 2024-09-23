import InputControl from "../utils/InputControl";
import InputControlTracked from "../utils/InputControlTracked";
import Button from "../utils/Button";
import Modal from "../utils/Modal";
import ChannelWebhook from "../../models/channel_webhook";
import { useContext, useState } from "react";
import { ChannelContext } from "../../context/channelContext";

interface ChannelWebhookUpdateProps {
    webhookEdit: ChannelWebhook | null | undefined;
    setWebhookEdit: (webhook: ChannelWebhook | null) => void;
    update: (e: any, file: any) => Promise<void>;
}

const ChannelWebhookUpdate = (props: ChannelWebhookUpdateProps) => {
    const { channels } = useContext(ChannelContext);
    const { webhookEdit, setWebhookEdit, update } = props;
    const [ file, setFile ] = useState('' as any);

    const updateHandler = (e: any) => {
        update(e, file).then(() => {
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
        <Modal title="Update Channel Webhook" show={webhookEdit} setShow={(s:any)=>{setWebhookEdit(null)}} slot={
            <div>
                <p className="text-md mb-3">
                    Enter the details to update the channel webhook.
                </p>

                <form onSubmit={updateHandler}>
                    <input type="hidden" name="uuid" value={webhookEdit?.uuid ||''} />
                    <InputControl id="webhook-update-name" type="text" label="Name" name="name" defaultValue={webhookEdit?.name ||''} />
                    <InputControl id="webhook-update-description" type="text" label="Desc" name="description" defaultValue={webhookEdit?.description ||''} />
                    
                    <InputControl id="webhook-update-channel-uuid" name="channel_uuid" type="select" label="Channel" defaultValue={webhookEdit?.channel_uuid ||''}
                        options={channels.map((channel) => (
                            <option key={channel.uuid} value={channel.uuid}>{channel.name}</option>
                        ))
                    } />
                    <InputControlTracked id="webhook-update-file" type="file" label="Avatar" name="file" value={webhookEdit?.room_file?.src ||''} onChange={(e: any) => fileHandler(e)} />

                    <div className="flex flex-col gap-2">
                        <Button type="primary" button="submit" slot="Update" />
                    </div>
                </form>
            </div>
        } />
    );
};

export default ChannelWebhookUpdate;
