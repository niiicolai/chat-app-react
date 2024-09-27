import InputControlTracked from "../utils/InputControlTracked";
import Button from "../utils/Button";
import Modal from "../utils/Modal";
import Spinner from "../utils/Spinner";
import Alert from "../utils/Alert";
import { useContext, JSX, FormEvent } from "react";
import { ChannelContext } from "../../context/channelContext";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

/**
 * @interface ChannelWebhookCreateProps
 * @description The props for the ChannelWebhookCreate component
 */
interface ChannelWebhookCreateProps {
    showWebhookCreate: boolean;
    setShowWebhookCreate: (show: boolean) => void;
    create: (e: FormEvent<HTMLFormElement>, file: string | Blob) => Promise<void>;
}

/**
 * @function ChannelWebhookCreate
 * @param {ChannelWebhookCreateProps} props
 * @returns {JSX.Element}
 */
const ChannelWebhookCreate = (props: ChannelWebhookCreateProps): JSX.Element => {
    const { channels } = useContext(ChannelContext);
    const { showWebhookCreate, setShowWebhookCreate, create } = props;
    const [uuid, setUuid] = useState(uuidv4());
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [channelUuid, setChannelUuid] = useState('');
    const [file, setFile] = useState('' as string | Blob);
    const [error, setError] = useState('' as string);
    const [isLoading, setIsLoading] = useState(false);

    const createHandler = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        create(e, file)
            .then(() => {
                setUuid(uuidv4());
                setName('');
                setDescription('');
                setChannelUuid('');
                setFile('');
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

    const nameHandler = (e: FormEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setName(e.currentTarget.value);
    }

    const descriptionHandler = (e: FormEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setDescription(e.currentTarget.value);
    }

    const channelUuidHandler = (e: FormEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setChannelUuid(e.currentTarget.value);
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
        <Modal title="Create Channel Webhook" show={showWebhookCreate} setShow={setShowWebhookCreate} slot={
            <div>
                <Alert type="error" message={error} />

                <p className="text-md mb-3">
                    Enter the details to create a new channel webhook.
                </p>

                <form onSubmit={createHandler}>
                    <input type="hidden" name="uuid" value={uuid} />

                    <InputControlTracked 
                        id="webhook-create-name" 
                        type="text" 
                        label="Name" 
                        name="name" 
                        value={name} 
                        onChange={nameHandler} 
                    />
                    
                    <InputControlTracked 
                        id="webhook-create-description" 
                        type="text" 
                        label="Desc" 
                        name="description" 
                        value={description} 
                        onChange={descriptionHandler} 
                    />

                    <InputControlTracked 
                        id="webhook-create-channel-uuid" 
                        name="channel_uuid" 
                        type="select" 
                        label="Channel" 
                        value={channelUuid} 
                        onChange={channelUuidHandler}
                        options={channels.map((channel) => (
                            <option key={channel.uuid} value={channel.uuid}>{channel.name}</option>
                        ))}
                    />
                    <InputControlTracked
                        id="webhook-create-file"
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
        } />
    );
};

export default ChannelWebhookCreate;
