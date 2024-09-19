import type User from "./user";

export default interface RoomUser {
    uuid: string;
    room_uuid: string;
    user_uuid: string;
    room_user_role_name: string;
    created_at: string;
    updated_at: string;
    user: User;
}