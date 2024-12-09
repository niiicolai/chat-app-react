import InputControlTracked from "../../components/utils/InputControlTracked";
import Button from "../../components/utils/Button";
import Restricted from "../../components/utils/Restricted";
import Spinner from "../../components/utils/Spinner";
import Alert from "../../components/utils/Alert";
import RoomInviteLink from "../../models/room_invite_link";
import { FormEvent, useState, JSX, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetRoomInviteLink, useUpdateRoomInviteLink } from "../../hooks/useRoomInviteLinks";
import { ToastContext } from "../../context/toastContext";

/**
 * @function RoomInviteLinkEditView
 * @returns {JSX.Element}
 */
const RoomInviteLinkEditView = (): JSX.Element => {
    const navigate = useNavigate();
    const { addToast } = useContext(ToastContext);
    const { room_invite_link_uuid, room_uuid } = useParams<{ room_invite_link_uuid: string, room_uuid: string }>();
    const getRoomInviteLink = useGetRoomInviteLink(room_invite_link_uuid as string);
    const updateRoomInviteLink = useUpdateRoomInviteLink(room_invite_link_uuid as string);
    const link = getRoomInviteLink.data as RoomInviteLink;
    const [expiresAt, setExpiresAt] = useState('');
    const isLoading = getRoomInviteLink.isLoading || updateRoomInviteLink.isLoading;
    const error = getRoomInviteLink.error || updateRoomInviteLink.error;

    const expiredAtHandler = (e: FormEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setExpiresAt(e.currentTarget.value);
    }

    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (expiresAt && new Date(expiresAt) < new Date()) {
            addToast({ message: 'The expiration date cannot be in the past', type: 'error', duration: 5000 });
            return;
        }

        await updateRoomInviteLink.mutateAsync({
            uuid: room_invite_link_uuid as string,
            body: { expires_at: expiresAt || link?.expires_at }
        });
        link.expires_at = expiresAt;

        navigate(`/room/${room_uuid}/links`);
        addToast({ message: 'Invite link updated', type: 'success', duration: 5000 });
    }

    const clearExpiresAt = async () => {
        await updateRoomInviteLink.mutateAsync({
            uuid: room_invite_link_uuid as string,
            body: { expires_at: '' }
        });
        link.expires_at = '';

        navigate(`/room/${room_uuid}/links`);
        addToast({ message: 'Invite link updated', type: 'success', duration: 5000 });
    }

    return (
        <Restricted slot={
            <div className="bg-black min-h-screen text-white">

                <div className="flex gap-3 justify-between p-3 border-b border-gray-800">
                    <div className="text-lg font-bold">
                        Edit Room Invite Link
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

                <div className="p-3">
                    <Alert type="error" message={error} testId="room-invite-link-edit-alert-message" />

                    <p className="text-md mb-3">
                        Enter the details to update the invite link.
                    </p>

                    <form onSubmit={submitHandler} data-testid="room-invite-link-edit-form">
                        <div className="flex gap-1">
                            <div className="w-full">
                                <InputControlTracked
                                    id="invite-link-create-expires-at"
                                    label="Expires At"
                                    type="datetime-local"
                                    name="expires_at"
                                    value={expiresAt}
                                    onChange={expiredAtHandler}
                                />
                            </div>

                            {link?.expires_at &&
                                <Button
                                    type="primary"
                                    button="button"
                                    slot="Clear"
                                    display="mb-3 w-12"
                                    onClick={() => clearExpiresAt()}
                                />
                            }
                        </div>

                        <div className="flex gap-1 items-center mb-3">
                            <p className="text-sm text-gray-500">
                                Current Expires At:
                            </p>
                            <p className="text-md" data-testid="room-invite-link-edit-expires-at-current">
                                {link?.expires_at || 'Never'}
                            </p>
                        </div>

                        <div className="flex flex-col gap-2">
                            {
                                isLoading
                                    ? <Spinner isLoading={isLoading} width="2em" fill="white" />
                                    : (<>
                                        <Button type="primary" button="submit" slot="Update" />
                                        <Button
                                            type="secondary"
                                            button="button"
                                            slot="Cancel"
                                            onClick={() => { navigate(`/room/${room_uuid}/links`) }}
                                        />
                                    </>)
                            }
                        </div>
                    </form>
                </div>
            </div>
        } />
    );
};

export default RoomInviteLinkEditView;
