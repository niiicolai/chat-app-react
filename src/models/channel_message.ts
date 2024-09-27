import type ChannelWebhookMessage from "./channel_webhook_message";
import type ChannelMessageUpload from "./channel_message_upload";
import type User from "./user";

/**
 * @interface ChannelMessage
 * @description The ChannelMessage interface
 */
export default interface ChannelMessage {
    uuid: string;
    body: string;
    channel_uuid: string;
    channel_message_type_name: string;
    user_uuid: string;
    created_at: string;
    updated_at: string;
    user: User | null;
    channel_webhook_message: ChannelWebhookMessage | null;
    channel_message_upload: ChannelMessageUpload | null;
}