import useChannelWebhooks from "../../hooks/useChannelWebhooks";
import ChannelWebhook from "../../models/channel_webhook";
import ChannelWebhookList from "./ChannelWebhookList";
import ChannelWehookCreate from "./ChannelWebhookCreate";
import ChannelWebhookUpdate from "./ChannelWebhookUpdate";
import ChannelWebhookTest from "./ChannelWebhookTest";
import ChannelWebhookService from "../../services/channelWebhookService";
import { useState } from "react";

interface ChannelWebhookMainProps {
    showWebhooks: boolean;
    setShowWebhooks: (show: boolean) => void;
}

const ChannelWebhookMain = (props: ChannelWebhookMainProps) => {
    const { showWebhooks, setShowWebhooks } = props;
    const { webhooks, setWebhooks } = useChannelWebhooks();
    const [ showWebhookCreate, setShowWebhookCreate ] = useState(false);
    const [ webhookTest, setWebhookTest ] = useState<ChannelWebhook | null>(null);
    const [ webhookEdit, setWebhookEdit ] = useState<ChannelWebhook | null>(null);

    const create = async (e: any, file: any) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        formData.set('file', file);
        const response = await ChannelWebhookService.create(formData);
        setWebhooks((webhooks: any) => [...webhooks, response]);
        setShowWebhookCreate(false);
    };

    const update = async (e: any, file: any) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);    
        formData.set('file', file);    
        const uuid = formData.get('uuid') as string;
        if (!uuid) return;
        const response = await ChannelWebhookService.update(uuid, formData);
        setWebhooks((webhooks: any) => webhooks.map((webhook: any) => webhook.uuid === uuid ? response : webhook));
        setWebhookEdit(null);
    };

    const destroy = async (uuid: string) => {
        await ChannelWebhookService.destroy(uuid);
        setWebhooks((webhooks: any) => webhooks.filter((webhook: any) => webhook.uuid !== uuid));
    };

    const testWebhook = async (e: any) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const uuid = formData.get('uuid') as string;
        const message = formData.get('message') as string;
        await ChannelWebhookService.test(uuid, { message });
        setWebhookTest(null);
    };

    return (
        <div>
            <ChannelWebhookList 
                webhooks={webhooks} 
                showWebhooks={showWebhooks} 
                setShowWebhookCreate={setShowWebhookCreate}
                setWebhookTest={setWebhookTest} 
                setShowWebhooks={setShowWebhooks} 
                setWebhookEdit={setWebhookEdit} 
                destroyWebhook={destroy}
            />
            <ChannelWehookCreate 
                showWebhookCreate={showWebhookCreate} 
                setShowWebhookCreate={setShowWebhookCreate} 
                create={create} 
            />
            <ChannelWebhookUpdate 
                webhookEdit={webhookEdit} 
                setWebhookEdit={setWebhookEdit} 
                update={update} 
            />
            <ChannelWebhookTest
                webhookTest={webhookTest} 
                setWebhookTest={setWebhookTest} 
                testWebhook={testWebhook} 
            />
        </div>
    );
};

export default ChannelWebhookMain;
