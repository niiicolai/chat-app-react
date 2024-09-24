import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import RoomService from "../services/roomService";
import RoomInviteLinkService from "../services/roomInviteLinkService";
import Room from "../models/room";
import RoomInviteLink from "../models/room_invite_link";

/**
 * @interface UseJoinRoom
 * @description The join room hook interface
 */
interface UseJoinRoom {
    room: Room | null;
    roomInviteLink: RoomInviteLink | null;
    error: string | null;
    isLoading: boolean;
}

/**
 * @function useJoinRoom
 * @description The join room hook
 * @returns {UseJoinRoom} The join room hook
 */
const useJoinRoom = (): UseJoinRoom => {
    const { roomInviteLinkUuid } = useParams<{ roomInviteLinkUuid: string }>();
    const [ room, setRoom ] = useState<Room | null>(null);
    const [ roomInviteLink, setRoomInviteLink ] = useState<RoomInviteLink | null>(null);
    const [ error, setError ] = useState<string | null>(null);
    const [ isLoading, setLoading ] = useState(false);

    useEffect(() => {
        if (!roomInviteLinkUuid) {
            setError("Invalid room invite link");
            return;
        }
        
        (async () => {
            try {
                setLoading(true);
                await RoomInviteLinkService.join(roomInviteLinkUuid);
                const roomInviteLink = await RoomInviteLinkService.findOne(roomInviteLinkUuid);
                setRoomInviteLink(roomInviteLink);
                const room = await RoomService.findOne(roomInviteLink.room_uuid);
                setRoom(room);
            } catch (err: unknown) {
                if (err instanceof Error)
                    setError(err.message);
                else
                    setError("An unknown error occurred");
            } finally {
                setLoading(false);
            }
        })();

    }, [roomInviteLinkUuid]);

    return {
        room,
        roomInviteLink,
        error,
        isLoading,
    };
}

export default useJoinRoom;
