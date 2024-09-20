import useChannelWebhooks from "../../hooks/useChannelWebhooks";
import Modal from "../utils/Modal";
import { useState } from "react";

const ChannelWebhookList = (props: any) => {
    const { showWebhooks, setShowWebhooks } = props;
    const { webhooks, error, isLoading } = useChannelWebhooks();
    const [ showWebhookCreate, setShowWebhookCreate ] = useState(false);
    const [ showWebhookUpdate, setShowWebhookUpdate ] = useState(false);
    return (
        <Modal title="Channel Webhooks" show={showWebhooks} setShow={setShowWebhooks} slot={
            <div>
                <ul className="flex flex-col gap-3 mb-3">
                    {webhooks.map((webhook) => (
                        <li key={webhook.uuid} className="flex flex-col gap-1">
                            <span className="text-white">{webhook.uuid}</span>
                        </li>
                    ))}
                    {!webhooks.length && <li className="text-white">No channel webhooks found</li>}
                </ul>
            </div>
        } />
    );
};

export default ChannelWebhookList;
