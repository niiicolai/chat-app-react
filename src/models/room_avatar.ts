import type RoomFile from "./room_file";

export default interface RoomAvatar {
    uuid: string;
    room_file: RoomFile;
}