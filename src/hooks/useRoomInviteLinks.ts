import RoomInviteLinkService from "../services/roomInviteLinkService";
import RoomInviteLink from "../models/room_invite_link";
import { useEffect, useState, useContext } from "react";
import { RoomContext } from "../context/roomContext";

/**
 * @interface UseRoomInviteLinks
 * @description The room invite link hook interface
 */
interface UseRoomInviteLinks {
    inviteLinks: RoomInviteLink[];
    setInviteLinks: (inviteLinks: RoomInviteLink[]) => void;
    error: string;
    isLoading: boolean;
}

/**
 * @function useRoomInviteLinks
 * @description The room invite link hook
 * @returns {UseRoomInviteLinks} The room invite link hook
 */
const useRoomInviteLinks = (): UseRoomInviteLinks => {
    const { selectedRoom } = useContext(RoomContext);
    const [inviteLinks, setInviteLinks] = useState<RoomInviteLink[]>([]);
    const [error, setError] = useState("");
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        if (!selectedRoom) return;

        setLoading(true);
        RoomInviteLinkService.findAll(selectedRoom.uuid)
            .then(setInviteLinks)
            .catch((err: unknown) => {
                if (err instanceof Error) setError(err.message);
                else setError("An unknown error occurred");
            })
            .finally(() => setLoading(false));

        return () => { }
    }, [selectedRoom]);

    return {
        inviteLinks,
        setInviteLinks,
        error,
        isLoading,
    };
}

export default useRoomInviteLinks;
