import type ChannelWebhook from "./channel_webhook";

/**
 * @interface ChannelWebhookMessage
 * @description The ChannelWebhookMessage interface
 */
export default interface ChannelWebhookMessage {
    uuid: string;
    channel_webhook: ChannelWebhook;
}