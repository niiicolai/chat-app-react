import InputControlTracked from "../utils/InputControlTracked";
import Button from "../utils/Button";
import Modal from "../utils/Modal";
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
    const [ message, setMessage ] = useState('');
    const show = webhookTest !== null;

    const submitHandler = (e: FormEvent<HTMLFormElement>) => {
        testWebhook(e).then(() => {
            setMessage('');
        });
    }

    const messageHandler = (e: FormEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const target = e.target as HTMLInputElement;
        setMessage(target.value);
    }

    return (
        <Modal title="Test Channel Webhook" show={show} setShow={()=>setWebhookTest(null)} slot={
            <div>
                <p className="text-md mb-3">
                    Enter the details to test the channel webhook.
                </p>

                <form onSubmit={submitHandler}>
                    <input type="hidden" name="uuid" value={webhookTest.uuid} />
                    <InputControlTracked 
                        id="webhook-test-body" 
                        type="text" 
                        label="Message" 
                        name="message" 
                        value={message} 
                        onChange={messageHandler} />
                    
                    <div className="flex flex-col gap-2">
                        <Button type="primary" button="submit" slot="Test" />
                    </div>
                </form>
            </div>
        } />
    );
};

export default ChannelWebhookTest;
