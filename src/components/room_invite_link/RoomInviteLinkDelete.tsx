import { useState, useContext, JSX, FormEvent } from "react";
import { ToastContext } from "../../context/toastContext";
import InputControlTracked from "../utils/InputControlTracked";
import Button from "../utils/Button";
import Modal from "../utils/Modal";
import Spinner from "../utils/Spinner";
import RoomInviteLink from "../../models/room_invite_link";

/**
 * @constant CLIENT_URL
 * @description The client url
 * @example 'http://localhost:5173'
 */
const CLIENT_URL = import.meta.env.VITE_CLIENT_URL;
if (!CLIENT_URL) console.error('CONFIGURATION ERROR(RoomInviteLinkListItem.tsx): VITE_CLIENT_URL should be set in the .env file');

/**
 * @interface RoomInviteLinkDeleteProps
 * @description The props for the RoomInviteLinkDelete component
 */
interface RoomInviteLinkDeleteProps {
    linkDelete: RoomInviteLink;
    setLinkDelete: (link: RoomInviteLink | null) => void;
    destroyRoomInviteLink: (uuid: string) => Promise<void>;
}

/**
 * @function RoomInviteLinkDelete
 * @param {RoomInviteLinkDeleteProps} props
 * @returns {JSX.Element}
 */
const RoomInviteLinkDelete = (props: RoomInviteLinkDeleteProps): JSX.Element => {
    const { linkDelete, setLinkDelete, destroyRoomInviteLink } = props;
    const { addToast } = useContext(ToastContext);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ answer, setAnswer ] = useState("");
    const url = new URL(`/room/${linkDelete.uuid}/join`, CLIENT_URL).toString();
    const show = linkDelete !== null;

    const destroy = async (uuid: string | undefined) => {
        if (!uuid) return;
        setIsLoading(true);
        if (answer.toLowerCase() !== 'yes') {
            addToast({ message: 'Please confirm deletion by typing "yes"', type: 'error', duration: 5000 });
            setIsLoading(false);
            return;
        }

        try {
            await destroyRoomInviteLink(uuid);
        } catch (err: unknown) {
            if (err instanceof Error) {
                addToast({ message: err.message, type: 'error', duration: 5000 });
            } else {
                addToast({ message: 'An unknown error occurred', type: 'error', duration: 5000 });
            }
        } finally {
            setIsLoading(false);
            setLinkDelete(null);
        }
    }

    const answerHandler = (event: FormEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setAnswer(event.currentTarget.value);
    }

    return (
        <Modal title="Delete Room Invite Link" show={show} setShow={()=>setLinkDelete(null)} slot={
            <div data-testid="room-invite-link-delete-modal">
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
                            Enter 'yes' to confirm deletion ({url}):
                        </p>

                        <InputControlTracked id="room-invite-link-delete-answer" type="text" label="Answer" name="confirm" value={answer} onChange={answerHandler} />

                        <div className="flex justify-end gap-3">
                            <Button onClick={() => setLinkDelete(null)} display="p-3" button="button" type="secondary" slot="Cancel" testId="room-invite-link-delete-cancel-button" />
                            <Button onClick={() => destroy(linkDelete.uuid)} display="p-3" button="button" type="error" slot="Delete" testId="room-invite-link-delete-confirm-button" />
                        </div>
                    </div>
                }

            </div>
        } />
    );
};

export default RoomInviteLinkDelete;
