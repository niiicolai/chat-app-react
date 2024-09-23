import type RoomFile from "./room_file";

export default interface ChannelMessageUpload {
    uuid: string;
    channel_message_upload_type_name: string;
    channel_message_uuid: string;
    room_file: RoomFile;
}