import InputControlTracked from "../../components/utils/InputControlTracked";
import Button from "../../components/utils/Button";
import Restricted from "../../components/utils/Restricted";
import Spinner from "../../components/utils/Spinner";
import Alert from "../../components/utils/Alert";
import RoomInviteLink from "../../models/room_invite_link";
import { ToastContext } from "../../context/toastContext";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useContext, JSX, FormEvent } from "react";
import { useGetRoomInviteLink, useDestroyRoomInviteLink } from "../../hooks/useRoomInviteLinks";

/**
 * @constant CLIENT_URL
 * @description The client url
 * @example 'http://localhost:5173'
 */
const CLIENT_URL = import.meta.env.VITE_CLIENT_URL;
if (!CLIENT_URL) console.error('CONFIGURATION ERROR(RoomInviteLinkListItem.tsx): VITE_CLIENT_URL should be set in the .env file');

/**
 * @function RoomInviteLinkDeleteView
 * @returns {JSX.Element}
 */
const RoomInviteLinkDeleteView = (): JSX.Element => {
    const navigate = useNavigate();
    const { addToast } = useContext(ToastContext);
    const { room_invite_link_uuid, room_uuid } = useParams<{ room_invite_link_uuid: string, room_uuid: string }>();
    const getRoomInviteLink = useGetRoomInviteLink(room_invite_link_uuid as string);
    const destroyRoomInviteLink = useDestroyRoomInviteLink(room_invite_link_uuid as string);
    const link = getRoomInviteLink.data as RoomInviteLink;
    const isLoading = getRoomInviteLink.isLoading || destroyRoomInviteLink.isLoading;
    const error = getRoomInviteLink.error || destroyRoomInviteLink.error;
    const [answer, setAnswer] = useState("");

    const destroyHandler = async () => {
        if (!room_invite_link_uuid) return;

        if (answer.toLowerCase() !== 'yes') {
            addToast({ message: 'Please confirm deletion by typing "yes"', type: 'error', duration: 5000 });
            return;
        }

        await destroyRoomInviteLink.mutateAsync(room_invite_link_uuid);
        navigate(`/room/${room_uuid}/links`);
        addToast({ message: 'Room invite link deleted', type: 'success', duration: 5000 });
    }

    const answerHandler = (event: FormEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setAnswer(event.currentTarget.value);
    }

    return (
        <Restricted slot={
            <div className="bg-black min-h-screen text-white">

                <div className="flex gap-3 justify-between p-3 border-b border-gray-800">
                    <div className="text-lg font-bold">
                        Delete Room Invite Link
                    </div>

                    <div>
                        <Button
                            onClick={() => navigate(`/room/${room_uuid}/links`)}
                            display="px-3 py-1 w-full block text-sm"
                            slot="Back to Links"
                            title="Back to Links"
                        />
                    </div>
                </div>

                <div className="p-3" data-testid="room-invite-link-delete-modal">
                    <Alert type="error" message={error} />

                    {isLoading &&
                        <div className="flex flex-col items-center justify-center gap-2">
                            <Spinner isLoading={true} fill="white" width="2em" />
                            <p className="text-md">Deleting room invite link...</p>
                        </div>
                    }

                    {!isLoading &&
                        <div>
                            <p className="text-md mb-3">
                                Are you sure you want to delete this room invite link? The action is irreversible. All data associated with this room will be lost.
                            </p>

                            <p className="text-md mb-3" data-testid="room-delete-confirm-description">
                                Enter yes to confirm deletion ({`${CLIENT_URL}/room/${link?.uuid}/join`}):
                            </p>

                            <InputControlTracked id="room-invite-link-delete-answer" type="text" label="Answer" name="confirm" value={answer} onChange={answerHandler} />

                            <div className="flex justify-end gap-3">
                                <Button onClick={() => navigate(`/room/${room_uuid}/links`)} display="p-3" button="button" type="secondary" slot="Cancel" testId="room-invite-link-delete-cancel-button" />
                                <Button onClick={() => destroyHandler()} display="p-3" button="button" type="error" slot="Delete" testId="room-invite-link-delete-confirm-button" />
                            </div>
                        </div>
                    }
                </div>
            </div>
        } />
    );
};

export default RoomInviteLinkDeleteView;
