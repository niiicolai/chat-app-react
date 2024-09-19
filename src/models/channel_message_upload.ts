import type RoomFile from "./room_file";

export default interface ChannelMessageUpload {
    uuid: string;
    src: string;
    upload_type_name: string;
    size: number;
    size_mb: number;
    channel_message_uuid: string;
    created_at: string;
    updated_at: string;
    room_file: RoomFile;
}