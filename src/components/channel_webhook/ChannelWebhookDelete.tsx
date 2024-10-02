import { useState, useContext, JSX, FormEvent } from "react";
import { ToastContext } from "../../context/toastContext";
import InputControlTracked from "../utils/InputControlTracked";
import Button from "../utils/Button";
import Modal from "../utils/Modal";
import Spinner from "../utils/Spinner";
import ChannelWebhook from "../../models/channel_webhook";

/**
 * @interface ChannelWebhookDeleteProps
 * @description The props for the ChannelWebhookDelete component
 */
interface ChannelWebhookDeleteProps {
    webhookDelete: ChannelWebhook;
    setWebhookDelete: (link: ChannelWebhook | null) => void;
    destroyChannelWebhook: (uuid: string) => Promise<void>;
}

/**
 * @function ChannelWebhookDelete
 * @param {ChannelWebhookDeleteProps} props
 * @returns {JSX.Element}
 */
const ChannelWebhookDelete = (props: ChannelWebhookDeleteProps): JSX.Element => {
    const { webhookDelete, setWebhookDelete, destroyChannelWebhook } = props;
    const { addToast } = useContext(ToastContext);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ name, setName ] = useState("");
    const show = webhookDelete !== null;

    const destroy = async (uuid: string | undefined) => {
        if (!uuid) return;
        setIsLoading(true);
        if (name.toLowerCase() !== webhookDelete.name.toLowerCase()) {
            addToast({ message: 'The provided name must match: ' + webhookDelete.name, type: 'error', duration: 5000 });
            setIsLoading(false);
            return;
        }

        try {
            await destroyChannelWebhook(uuid);
        } catch (err: unknown) {
            if (err instanceof Error) {
                addToast({ message: err.message, type: 'error', duration: 5000 });
            } else {
                addToast({ message: 'An unknown error occurred', type: 'error', duration: 5000 });
            }
        } finally {
            setIsLoading(false);
            setWebhookDelete(null);
        }
    }

    const nameHandler = (event: FormEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setName(event.currentTarget.value);
    }

    return (
        <Modal title="Delete ChannelWebhook" show={show} setShow={()=>setWebhookDelete(null)} slot={
            <div data-testid="channel-webhook-delete-modal">
                {isLoading &&
                    <div className="flex flex-col items-center justify-center gap-2">
                        <Spinner isLoading={true} fill="white" width="2em" />
                        <p className="text-md">Deleting channel webook...</p>
                    </div>
                }

                {!isLoading &&
                    <div>
                        <p className="text-md mb-3">
                            Are you sure you want to delete this channel webook? The action is irreversible. All data associated with this room will be lost.
                        </p>

                        <p className="text-md mb-3" data-testid="channel-webhook-confirm-description">
                            Enter the name of the channel webhook to confirm deletion ({webhookDelete.name}).
                        </p>

                        <InputControlTracked id="channel-webhook-delete-name" type="text" label="Name" name="name" value={name} onChange={nameHandler} />

                        <div className="flex justify-end gap-3">
                            <Button onClick={() => setWebhookDelete(null)} display="p-3" button="button" type="secondary" slot="Cancel" testId="channel-webhook-delete-cancel-button" />
                            <Button onClick={() => destroy(webhookDelete.uuid)} display="p-3" button="button" type="error" slot="Delete" testId="channel-webhook-delete-confirm-button" />
                        </div>
                    </div>
                }

            </div>
        } />
    );
};

export default ChannelWebhookDelete;
