import type ChannelWebhook from "./channel_webhook";

export default interface ChannelWebhookMessage {
    uuid: string;
    channel_webhook: ChannelWebhook;
}