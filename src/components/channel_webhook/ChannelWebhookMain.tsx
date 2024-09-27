import useChannelWebhooks from "../../hooks/useChannelWebhooks";
import ChannelWebhook from "../../models/channel_webhook";
import ChannelWebhookList from "./ChannelWebhookList";
import ChannelWehookCreate from "./ChannelWebhookCreate";
import ChannelWebhookUpdate from "./ChannelWebhookUpdate";
import ChannelWebhookTest from "./ChannelWebhookTest";
import ChannelWebhookService from "../../services/channelWebhookService";
import { useState, JSX, FormEvent } from "react";

/**
 * @interface ChannelWebhookMainProps
 * @description The props for the ChannelWebhookMain component
 */
interface ChannelWebhookMainProps {
    showWebhooks: boolean;
    setShowWebhooks: (show: boolean) => void;
}

/**
 * @function ChannelWebhookMain
 * @param {ChannelWebhookMainProps} props
 * @returns {JSX.Element}
 */
const ChannelWebhookMain = (props: ChannelWebhookMainProps): JSX.Element => {
    const { showWebhooks, setShowWebhooks } = props;
    const { webhooks, setWebhooks } = useChannelWebhooks();
    const [showWebhookCreate, setShowWebhookCreate] = useState(false);
    const [webhookTest, setWebhookTest] = useState<ChannelWebhook | null>(null);
    const [webhookEdit, setWebhookEdit] = useState<ChannelWebhook | null>(null);

    const create = async (e: FormEvent<HTMLFormElement>, file: string | Blob) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        formData.set('file', file);
        const response = await ChannelWebhookService.create(formData);
        setWebhooks([...webhooks, response]);
        setShowWebhookCreate(false);
    };

    const update = async (e: FormEvent<HTMLFormElement>, file: string | Blob) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        formData.set('file', file);
        const uuid = formData.get('uuid') as string;
        if (!uuid) return;
        const response = await ChannelWebhookService.update(uuid, formData);
        setWebhooks(webhooks.map((webhook: ChannelWebhook) => webhook.uuid === uuid ? response : webhook));
        setWebhookEdit(null);
    };

    const destroy = async (uuid: string) => {
        await ChannelWebhookService.destroy(uuid);
        setWebhooks(webhooks.filter((webhook: ChannelWebhook) => webhook.uuid !== uuid));
    };

    const testWebhook = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const uuid = formData.get('uuid') as string;
        const message = formData.get('message') as string;
        await ChannelWebhookService.test(uuid, { message });
        setWebhookTest(null);
    };

    if (webhookTest) {
        return (
            <ChannelWebhookTest
                webhookTest={webhookTest}
                setWebhookTest={setWebhookTest}
                testWebhook={testWebhook}
            />
        );
    } else if (showWebhookCreate) {
        return (
            <ChannelWehookCreate
                showWebhookCreate={showWebhookCreate}
                setShowWebhookCreate={setShowWebhookCreate}
                create={create}
            />
        );
    } else if (webhookEdit) {
        return (
            <ChannelWebhookUpdate
                webhookEdit={webhookEdit}
                setWebhookEdit={setWebhookEdit}
                update={update}
            />
        );
    }

    return (
        <ChannelWebhookList
            webhooks={webhooks}
            showWebhooks={showWebhooks}
            setShowWebhookCreate={setShowWebhookCreate}
            setWebhookTest={setWebhookTest}
            setShowWebhooks={setShowWebhooks}
            setWebhookEdit={setWebhookEdit}
            destroyWebhook={destroy}
        />
    );
};

export default ChannelWebhookMain;
