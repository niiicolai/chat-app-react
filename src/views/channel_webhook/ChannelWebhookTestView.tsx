import InputControlTracked from "../../components/utils/InputControlTracked";
import Button from "../../components/utils/Button";
import Restricted from "../../components/utils/Restricted";
import Spinner from "../../components/utils/Spinner";
import Alert from "../../components/utils/Alert";
import { useState, JSX, FormEvent, useContext } from "react";
import { ToastContext } from "../../context/toastContext";
import { useNavigate, useParams } from "react-router-dom";
import { useTestChannelWebhook } from "../../hooks/useChannelWebhooks";

/**
 * @function ChannelWebhookTestView
 * @returns {JSX.Element}
 */
const ChannelWebhookTestView = (): JSX.Element => {
    const navigate = useNavigate();
    const { addToast } = useContext(ToastContext);
    const { room_uuid, channel_webhook_uuid } = useParams<{ room_uuid: string, channel_webhook_uuid: string }>();
    const { mutateAsync, isLoading, error } = useTestChannelWebhook();
    const [message, setMessage] = useState('');

    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!channel_webhook_uuid) return;

        if (message === '') {
            addToast({ message: 'Message is required', type: 'error', duration: 5000 });
            return;
        }

        try {
            await mutateAsync({ uuid: channel_webhook_uuid, message });
            addToast({ message: 'Webhook test sent', type: 'success', duration: 5000 });
            setMessage('');
        } catch (error) {
            addToast({ message: 'Error sending webhook test', type: 'error', duration: 5000 });
        }
    }

    const messageHandler = (e: FormEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const target = e.target as HTMLInputElement;
        setMessage(target.value);
    }

    return (
        <Restricted slot={
            <div className="bg-black min-h-screen text-white">

                <div className="flex gap-3 justify-between p-3 border-b border-gray-800">
                    <div className="text-lg font-bold">
                        Test Webhook
                    </div>

                    <div>
                        <Button
                            onClick={() => navigate(`/room/${room_uuid}/webhooks`) }	
                            display="px-3 py-1 w-full block text-sm"
                            slot="Dashboard"
                            title="Dashboard"
                        />
                    </div>
                </div>

                <div className="p-3">

                    <Alert type="error" message={error} testId="channel-webhook-test-alert-message" />

                    <p className="text-md mb-3">
                        Enter the details to test the channel webhook.
                    </p>

                    <form onSubmit={submitHandler} data-testid="channel-webhook-test-form">
                        <input type="hidden" name="uuid" value={channel_webhook_uuid} />

                        <InputControlTracked
                            id="webhook-test-body"
                            type="text"
                            label="Message"
                            name="message"
                            value={message}
                            onChange={messageHandler}
                        />

                        <Button type="primary" button="submit" slot={
                            <span>
                                {isLoading
                                    ? <Spinner isLoading={isLoading} width="2em" fill="white" />
                                    : "Test"
                                }
                            </span>
                        } />
                    </form>
                </div>
            </div>
        } />
    );
};

export default ChannelWebhookTestView;
