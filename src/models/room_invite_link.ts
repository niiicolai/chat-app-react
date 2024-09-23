export default interface RoomInviteLink {
    uuid: string;
    room_uuid: string;
    expires_at: string;
    never_expires: boolean;
    created_at: string;
    updated_at: string;
}