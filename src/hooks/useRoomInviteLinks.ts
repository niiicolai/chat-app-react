import RoomInviteLinkService from "../services/roomInviteLinkService";
import RoomInviteLink from "../models/room_invite_link";
import { useEffect, useState, useContext } from "react";
import { RoomContext } from "../context/roomContext";

const useRoomInviteLinks = () => {
    const { room } = useContext(RoomContext);
    const [inviteLinks, setInviteLinks] = useState<RoomInviteLink[]>([]);
    const [error, setError] = useState("");
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        if (!room) return;

        setLoading(true);
        RoomInviteLinkService.findAll(room.uuid)
            .then(setInviteLinks)
            .catch((err: any) => setError(err.message))
            .finally(() => setLoading(false));

        return () => { }
    }, []);

    return {
        inviteLinks,
        setInviteLinks,
        error,
        isLoading,
    };
}

export default useRoomInviteLinks;
