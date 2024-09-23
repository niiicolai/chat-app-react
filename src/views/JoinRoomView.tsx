import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import RoomService from "../services/roomService";
import RoomInviteLinkService from "../services/roomInviteLinkService";
import Room from "../models/room";
import RoomInviteLink from "../models/room_invite_link";
import Alert from "../components/utils/Alert";
import Button from "../components/utils/Button";
import Spinner from "../components/utils/Spinner";

function JoinRoomView() {
    const { roomInviteLinkUuid } = useParams<{ roomInviteLinkUuid: string }>();
    const [room, setRoom] = useState<Room | null>(null);
    const [roomInviteLink, setRoomInviteLink] = useState<RoomInviteLink | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setLoading] = useState(false);
    const navigate = useNavigate();

    const toApp = () => {
        navigate("/");
    }

    useEffect(() => {
        if (!roomInviteLinkUuid) return;
        setLoading(true);
        RoomInviteLinkService.join(roomInviteLinkUuid)
            .then(() => {
                RoomInviteLinkService.findOne(roomInviteLinkUuid)
                    .then((roomInviteLink) => {
                        setRoomInviteLink(roomInviteLink);
                        return roomInviteLink.room_uuid;
                    })
                    .then(RoomService.findOne)
                    .then(setRoom)
                    .catch((err: any) => setError(err.message));
            })
            .catch((err: any) => setError(err.message))
            .finally(() => setLoading(false));

    }, [roomInviteLinkUuid]);

    return (
        <div className="App w-full h-screen bg-black text-white flex items-center justify-center">
            <Alert type="error" message={error} />
            {room && roomInviteLink && (
                <div>
                    <h1 className="text-3xl font-bold mb-3">Welcome to {room?.name}</h1>
                    <p className="mb-3">
                        {room?.description}
                    </p>
                    <Button type="primary" onClick={toApp} slot="Go to App" />
                </div>
            )}
            {isLoading && (
                <div>
                    <h1 className="text-3xl font-bold mb-3">Joining Room</h1>
                    <Spinner isLoading={isLoading} width="2em" fill="white" />
                </div>
            )}
            {!room && !roomInviteLink && !error && !isLoading && (
                <div>
                    <h1 className="text-3xl font-bold mb-3">Something went wrong</h1>
                    <p className="mb-3">
                        This may be an error on the server, an invalid link or you may already be in the room.
                    </p>
                    <Button type="error" onClick={toApp} slot="Go to App" />
                </div>    
            )}

        </div>
    )
}

export default JoinRoomView
