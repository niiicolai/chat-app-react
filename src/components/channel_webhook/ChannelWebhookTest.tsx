import InputControlTracked from "../utils/InputControlTracked";
import Button from "../utils/Button";
import Modal from "../utils/Modal";
import ChannelWebhook from "../../models/channel_webhook";
import { useState } from "react";

interface ChannelWebhookTestProps {
    webhookTest: ChannelWebhook | null | undefined;
    setWebhookTest: (webhook: ChannelWebhook | null) => void;
    testWebhook: (e: any) => Promise<void>;
}

const ChannelWebhookTest = (props: ChannelWebhookTestProps) => {
    const { webhookTest, setWebhookTest, testWebhook } = props;
    const [ message, setMessage ] = useState('');

    const submitHandler = (e: any) => {
        testWebhook(e).then(() => {
            setMessage('');
        });
    }

    return (
        <Modal title="Test Channel Webhook" show={webhookTest} setShow={(s:any)=>setWebhookTest(null)} slot={
            <div>
                <p className="text-md mb-3">
                    Enter the details to test the channel webhook.
                </p>

                <form onSubmit={submitHandler}>
                    <input type="hidden" name="uuid" value={webhookTest?.uuid ||''} />
                    <InputControlTracked id="webhook-test-body" type="text" label="Message" name="message" value={message} onChange={(e: any) => setMessage(e.target.value)} />
                    
                    <div className="flex flex-col gap-2">
                        <Button type="primary" button="submit" slot="Test" />
                    </div>
                </form>
            </div>
        } />
    );
};

export default ChannelWebhookTest;
