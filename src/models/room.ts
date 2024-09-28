import type RoomAvatar from "./room_avatar";
import type RoomRulesSettings from "./room_rules_settings";
import type RoomChannelSettings from "./room_channel_settings";
import type RoomFileSettings from "./room_file_settings";
import type RoomUserSettings from "./room_user_settings";
import type RoomJoinSettings from "./room_join_settings";

/**
 * @interface Room
 * @description The Room interface
 */
export default interface Room {
    uuid: string;
    name: string;
    description: string;
    room_category_name: string;
    created_at: string;
    updated_at: string;
    bytes_used: number;
    mb_used: number;
    rulesSettings: RoomRulesSettings;
    channelSettings: RoomChannelSettings;
    fileSettings: RoomFileSettings;
    userSettings: RoomUserSettings;
    joinSettings: RoomJoinSettings;
    avatar: RoomAvatar | null;
}
