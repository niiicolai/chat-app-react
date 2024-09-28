import type RoomFile from "./room_file";

/**
 * @interface Channel
 * @description The Channel interface
 */
export default interface Channel {
    uuid: string;
    name: string;
    description: string;
    room_uuid: string;
    channel_type_name: string;
    created_at: string;
    updated_at: string;
    room_file: RoomFile | null;
}