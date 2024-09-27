
/**
 * @interface RoomFile
 * @description The RoomFile interface
 */
export default interface RoomFile {
    uuid: string;
    src: string;
    size: number;
    size_mb: number;
    room_uuid: string;
    room_file_type_name: string;
    created_at: string;
    updated_at: string;

    user: {
        uuid: string;
        username: string;
        avatar_src: string;
    };
    
    channel_message_upload: {
        uuid: string;
        channel_message_upload_type_name: string;
        channel_message: {
            uuid: string;
            body: string;
        };
    };
}
