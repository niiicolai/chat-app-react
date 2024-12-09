import InputControlTracked from "../../components/utils/InputControlTracked";
import Button from "../../components/utils/Button";
import Restricted from "../../components/utils/Restricted";
import Spinner from "../../components/utils/Spinner";
import Alert from "../../components/utils/Alert";
import { v4 as uuidv4 } from "uuid";
import { useState, useContext, JSX, FormEvent } from "react";
import { ToastContext } from "../../context/toastContext";
import { useParams, useNavigate } from "react-router-dom";
import { useCreateRoomInviteLink } from "../../hooks/useRoomInviteLinks";

/**
 * @function RoomInviteLinkCreateView
 * @returns {JSX.Element}
 */
const RoomInviteLinkCreateView = (): JSX.Element => {
    const navigate = useNavigate();
    const { addToast } = useContext(ToastContext);
    const { room_uuid } = useParams<{ room_uuid: string }>();
    const { mutateAsync, isLoading, error } = useCreateRoomInviteLink();
    const [uuid, setUuid] = useState(uuidv4());
    const [expiresAt, setExpiresAt] = useState('');

    const expiredAtHandler = (e: FormEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setExpiresAt(e.currentTarget.value);
    }

    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!room_uuid) return;

        if (expiresAt && new Date(expiresAt) < new Date()) {
            addToast({ message: 'The expiration date cannot be in the past', type: 'error', duration: 5000 });
            return;
        }

        // Use the uuid from the form to allow
        // the e2e test to set the uuid to a known value
        // for joining rooms in tests.
        const formData = new FormData(e.currentTarget);
        const uuid = formData.get("uuid") as string;

        try {
            await mutateAsync({
                uuid,
                room_uuid,
                expires_at: expiresAt
            });
            navigate(`/room/${room_uuid}/links`);
            addToast({ message: 'Invite link created successfully', type: 'success', duration: 5000 });
            setUuid(uuidv4());
        } catch {
            addToast({ message: 'Error creating invite link', type: 'error', duration: 5000 });
        }
    }

    return (
        <Restricted slot={
            <div className="bg-black min-h-screen text-white">

                <div className="flex gap-3 justify-between p-3 border-b border-gray-800">
                    <div className="text-lg font-bold">
                        Create Room Invite Link
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
                    <Alert type="error" message={error} testId="room-invite-link-create-alert-message" />

                    <p className="text-md mb-3">
                        Enter the details to create a shareable invite link for your room.
                    </p>

                    <form onSubmit={submitHandler} data-testid="room-invite-link-create-form">
                        <input type="hidden" name="uuid" value={uuid} />
                        
                        <div className="flex gap-1">
                            <div className="w-full">
                                <InputControlTracked
                                    onChange={expiredAtHandler}
                                    id="invite-link-create-expires-at"
                                    label="Expires At"
                                    type="datetime-local"
                                    name="expires_at"
                                    value={expiresAt}
                                />
                            </div>
                            {expiresAt &&
                                <Button
                                    type="primary"
                                    button="button"
                                    slot="Clear"
                                    display="mb-3 w-12"
                                    onClick={() => setExpiresAt('')}
                                />
                            }
                        </div>

                        <div className="flex flex-col gap-2">
                            {
                                isLoading
                                    ? <Spinner isLoading={isLoading} width="2em" fill="white" />
                                    : (<>
                                        <Button type="primary" button="submit" slot="Create" />
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

export default RoomInviteLinkCreateView;
