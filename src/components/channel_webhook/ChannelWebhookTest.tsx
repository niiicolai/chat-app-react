import InputControlTracked from "../utils/InputControlTracked";
import Button from "../utils/Button";
import Modal from "../utils/Modal";
import Spinner from "../utils/Spinner";
import Alert from "../utils/Alert";
import ChannelWebhook from "../../models/channel_webhook";
import { useState, JSX, FormEvent } from "react";

/**
 * @interface ChannelWebhookTestProps
 * @description The props for the ChannelWebhookTest component
 */
interface ChannelWebhookTestProps {
    webhookTest: ChannelWebhook;
    setWebhookTest: (webhook: ChannelWebhook | null) => void;
    testWebhook: (e: FormEvent<HTMLFormElement>) => Promise<void>;
}

/**
 * @function ChannelWebhookTest
 * @param {ChannelWebhookTestProps} props
 * @returns {JSX.Element}
 */
const ChannelWebhookTest = (props: ChannelWebhookTestProps): JSX.Element => {
    const { webhookTest, setWebhookTest, testWebhook } = props;
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const show = webhookTest !== null;

    const submitHandler = (e: FormEvent<HTMLFormElement>) => {
        setIsLoading(true);
        
        testWebhook(e).then(() => {
            setMessage('');
            setError('');
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

    const messageHandler = (e: FormEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const target = e.target as HTMLInputElement;
        setMessage(target.value);
    }

    return (
        <Modal title="Test Channel Webhook" show={show} setShow={() => setWebhookTest(null)} slot={
            <div>
                <Alert type="error" message={error} testId="channel-webhook-test-alert-message" />

                <p className="text-md mb-3">
                    Enter the details to test the channel webhook.
                </p>

                <form onSubmit={submitHandler} data-testid="channel-webhook-test-form">
                    <input type="hidden" name="uuid" value={webhookTest.uuid} />

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
        } />
    );
};

export default ChannelWebhookTest;
