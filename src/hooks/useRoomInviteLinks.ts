import RoomInviteLinkService from "../services/roomInviteLinkService";
import RoomInviteLink from "../models/room_invite_link";
import { useEffect, useState, useContext } from "react";
import { RoomContext } from "../context/roomContext";

const useRoomInviteLinks = () => {
    const { selectedRoom } = useContext(RoomContext);
    const [inviteLinks, setInviteLinks] = useState<RoomInviteLink[]>([]);
    const [error, setError] = useState("");
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        if (!selectedRoom) return;

        setLoading(true);
        RoomInviteLinkService.findAll(selectedRoom.uuid)
            .then(setInviteLinks)
            .catch((err: any) => setError(err.message))
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
