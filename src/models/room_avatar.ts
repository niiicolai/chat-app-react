import type RoomFile from "./room_file";

/**
 * @interface RoomAvatar
 * @description The RoomAvatar interface
 */
export default interface RoomAvatar {
    uuid: string;
    room_file: RoomFile | null;
}