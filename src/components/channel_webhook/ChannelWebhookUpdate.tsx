import InputControl from "../utils/InputControl";
import InputControlTracked from "../utils/InputControlTracked";
import Button from "../utils/Button";
import Modal from "../utils/Modal";
import Spinner from "../utils/Spinner";
import Alert from "../utils/Alert";
import ChannelWebhook from "../../models/channel_webhook";
import { useContext, useState, JSX, FormEvent } from "react";
import { ChannelContext } from "../../context/channelContext";

/**
 * @interface ChannelWebhookUpdateProps
 * @description The props for the ChannelWebhookUpdate component
 */
interface ChannelWebhookUpdateProps {
    webhookEdit: ChannelWebhook;
    setWebhookEdit: (webhook: ChannelWebhook | null) => void;
    destroyAvatar: (channelWebhook: ChannelWebhook) => Promise<void>;
    update: (e: FormEvent<HTMLFormElement>, file: string | Blob) => Promise<void>;
}

/**
 * @function ChannelWebhookUpdate
 * @param {ChannelWebhookUpdateProps} props
 * @returns {JSX.Element}
 */
const ChannelWebhookUpdate = (props: ChannelWebhookUpdateProps): JSX.Element => {
    const { webhookEdit, setWebhookEdit, update, destroyAvatar } = props;
    const { channels } = useContext(ChannelContext);
    const [file, setFile] = useState('' as string | Blob);
    const [error, setError] = useState('' as string);
    const [isLoading, setIsLoading] = useState(false);
    const show = webhookEdit !== null;

    const updateHandler = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        if (formData.get('name') === '') {
            setError("Invalid name");
            setIsLoading(false);
            return;
        }

        if (formData.get('description') === '') {
            setError("Invalid description");
            setIsLoading(false);
            return;
        }

        update(e, file)
        .then(() => {
            setFile('');
            setError('');
            setWebhookEdit(null);
        })
        .catch((err: unknown) => {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred");
            }
        })
        .finally(() => {
            setIsLoading(false);
        });
    }

    const destroyAvatarHandler = () => {
        if (!webhookEdit) return;

        destroyAvatar(webhookEdit)
        .then(() => {
            setFile('');
            setError('');
            setWebhookEdit(null);
        })
        .catch((err: unknown) => {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred");
            }
        });
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
        <Modal title="Update Channel Webhook" show={show} setShow={() => { setWebhookEdit(null) }} slot={
            <div>
                <Alert type="error" message={error} testId="channel-webhook-edit-alert-message" />

                <p className="text-md mb-3">
                    Enter the details to update the channel webhook.
                </p>

                <form onSubmit={updateHandler} data-testid="channel-webhook-edit-form">
                    <input type="hidden" name="uuid" value={webhookEdit.uuid} />
                    
                    <InputControl 
                        id="webhook-update-name" 
                        type="text" 
                        label="Name" 
                        name="name" 
                        defaultValue={webhookEdit.name} 
                    />

                    <InputControl 
                        id="webhook-update-description" 
                        type="text" 
                        label="Desc" 
                        name="description" 
                        defaultValue={webhookEdit.description} 
                    />

                    <InputControl 
                        id="webhook-update-channel-uuid" 
                        name="channel_uuid" 
                        type="select" 
                        label="Channel" 
                        defaultValue={webhookEdit.channel_uuid}
                        options={channels.map((channel) => (
                            <option key={channel.uuid} value={channel.uuid}>{channel.name}</option>
                        ))
                    } />

                    <InputControlTracked
                        id="webhook-update-file"
                        type="file"
                        label="Avatar"
                        name="file"
                        value={webhookEdit?.room_file?.src || ''}
                        onChange={fileHandler}
                        footerSlot={
                            <div>
                                {webhookEdit?.room_file?.src &&
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
                        <Button type="primary" button="submit" slot={
                            <span>
                                {isLoading
                                    ? <Spinner isLoading={isLoading} width="2em" fill="white" />
                                    : "Update"
                                }
                            </span>
                        } />
                    </div>
                </form>
            </div>
        } />
    );
};

export default ChannelWebhookUpdate;
