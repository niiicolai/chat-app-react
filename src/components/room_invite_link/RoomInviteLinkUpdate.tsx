import InputControlTracked from "../utils/InputControlTracked";
import Button from "../utils/Button";
import Modal from "../utils/Modal";
import Spinner from "../utils/Spinner";
import Alert from "../utils/Alert";
import RoomInviteLink from "../../models/room_invite_link";
import { FormEvent, useState, JSX } from "react";

/**
 * @interface RoomInviteLinkUpdateProps
 * @description The props for the RoomInviteLinkUpdate component
 */
interface RoomInviteLinkUpdateProps {
    linkEdit: RoomInviteLink | null | undefined;
    setLinkEdit: (link: RoomInviteLink | null) => void;
    update: (e: FormEvent<HTMLFormElement>) => Promise<void>;
}

/**
 * @function RoomInviteLinkUpdate
 * @param {RoomInviteLinkUpdateProps} props
 * @returns {JSX.Element}
 */
const RoomInviteLinkUpdate = (props: RoomInviteLinkUpdateProps): JSX.Element => {
    const { linkEdit, setLinkEdit, update } = props;
    const [ expiresAt, setExpiresAt ] = useState(linkEdit?.expires_at || '');
    const [ isLoading, setIsLoading ] = useState(false);
    const [ error, setError ] = useState<string | null>(null);
    const show = linkEdit ? true : false;

    const expiredAtHandler = (e: FormEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setExpiresAt(e.currentTarget.value);
    }

    const submitHandler = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        if (expiresAt && new Date(expiresAt) < new Date()) {
            setError("The expiration date cannot be in the past");
            setIsLoading(false);
            return;
        }

        update(e).then(() => {
            setError('');
            setLinkEdit(null);
        })
        .catch((err: unknown) => {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred");
            }
        })
        .finally(() => {
            setIsLoading(false);
        });
    }

    return (
        <Modal title="Update Invite Link" show={show} setShow={()=>setLinkEdit(null)} slot={
            <div>
                <Alert type="error" message={error} testId="room-invite-link-edit-alert-message" />

                <p className="text-md mb-3">
                    Enter the details to update the invite link.
                </p>

                <form onSubmit={submitHandler} data-testid="room-invite-link-edit-form">
                    <input type="hidden" name="uuid" value={linkEdit?.uuid ||''} />

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

                    <div className="flex gap-1 items-center mb-3">
                        <p className="text-sm text-gray-500">
                            Current Expires At:
                        </p>
                        <p className="text-md" data-testid="room-invite-link-edit-expires-at-current">
                            {linkEdit?.expires_at || 'Never'}
                        </p>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Button type="primary" button="submit" slot={
                            <span>
                                {isLoading 
                                    ? <Spinner isLoading={isLoading} width="2em" fill="white" /> 
                                    : "Update"
                                }
                            </span>
                        } />
                    </div>
                </form>
            </div>
        } />
    );
};

export default RoomInviteLinkUpdate;
