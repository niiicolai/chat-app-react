import type Channel from "./channel";
import type RoomFile from "./room_file";

/**
 * @interface ChannelWebhook
 * @description The ChannelWebhook interface
 */
export default interface ChannelWebhook {
    uuid: string;
    name: string;
    description: string;
    channel_uuid: string;
    created_at: string;
    updated_at: string;
    channel: Channel;
    room_file: RoomFile;
}