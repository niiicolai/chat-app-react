import useChannelWebhooks from "../../hooks/useChannelWebhooks";
import ChannelWebhook from "../../models/channel_webhook";
import ChannelWebhookList from "./ChannelWebhookList";
import ChannelWehookCreate from "./ChannelWebhookCreate";
import ChannelWebhookUpdate from "./ChannelWebhookUpdate";
import ChannelWebhookTest from "./ChannelWebhookTest";
import ChannelWebhookDelete from "./ChannelWebhookDelete";
import { useState, JSX } from "react";

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
    const [showWebhookCreate, setShowWebhookCreate] = useState(false);
    const [webhookTest, setWebhookTest] = useState<ChannelWebhook | null>(null);
    const [webhookEdit, setWebhookEdit] = useState<ChannelWebhook | null>(null);
    const [webhookDelete, setWebhookDelete] = useState<ChannelWebhook | null>(null);
    const cwCtrl = useChannelWebhooks();

    if (webhookTest) {
        return (
            <ChannelWebhookTest
                webhookTest={webhookTest}
                setWebhookTest={setWebhookTest}
                testWebhook={cwCtrl.testWebhook}
            />
        );
    } else if (showWebhookCreate) {
        return (
            <ChannelWehookCreate
                showWebhookCreate={showWebhookCreate}
                setShowWebhookCreate={setShowWebhookCreate}
                create={cwCtrl.create}
            />
        );
    } else if (webhookEdit) {
        return (
            <ChannelWebhookUpdate
                webhookEdit={webhookEdit}
                setWebhookEdit={setWebhookEdit}
                update={cwCtrl.update}
                destroyAvatar={cwCtrl.destroyAvatar}
            />
        );
    } else if (webhookDelete) {
        return (
            <ChannelWebhookDelete
                webhookDelete={webhookDelete}
                setWebhookDelete={setWebhookDelete}
                destroyChannelWebhook={cwCtrl.destroy}
            />
        );
    }

    return (
        <ChannelWebhookList
            webhooks={cwCtrl.webhooks}
            showWebhooks={props.showWebhooks}
            setShowWebhookCreate={setShowWebhookCreate}
            setWebhookTest={setWebhookTest}
            setShowWebhooks={props.setShowWebhooks}
            setWebhookEdit={setWebhookEdit}
            setWebhookDelete={setWebhookDelete}
            page={cwCtrl.page}
            pages={cwCtrl.pages}
            previousPage={cwCtrl.previousPage}
            nextPage={cwCtrl.nextPage}
            isLoading={cwCtrl.isLoading}
            error={cwCtrl.error}
        />
    );
};

export default ChannelWebhookMain;
