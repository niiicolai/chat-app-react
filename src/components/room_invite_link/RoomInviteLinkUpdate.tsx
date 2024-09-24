import InputControlTracked from "../utils/InputControlTracked";
import Button from "../utils/Button";
import Modal from "../utils/Modal";
import Spinner from "../utils/Spinner";
import Alert from "../utils/Alert";
import RoomInviteLink from "../../models/room_invite_link";
import { FormEvent, useState } from "react";

interface RoomInviteLinkUpdateProps {
    linkEdit: RoomInviteLink | null | undefined;
    setLinkEdit: (link: RoomInviteLink | null) => void;
    update: (e: FormEvent<HTMLFormElement>) => Promise<void>;
}
const RoomInviteLinkUpdate = (props: RoomInviteLinkUpdateProps) => {
    const { linkEdit, setLinkEdit, update } = props;
    const [ expiresAt, setExpiresAt ] = useState(linkEdit?.expires_at || '');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const submitHandler = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        update(e).then(() => {
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
        <Modal title="Update Invite Link" show={linkEdit} setShow={()=>setLinkEdit(null)} slot={
            <div>
                <Alert type="error" message={error} />

                <p className="text-md mb-3">
                    Enter the details to update the invite link.
                </p>

                <form onSubmit={submitHandler}>
                    <input type="hidden" name="uuid" value={linkEdit?.uuid ||''} />

                    <div className="flex gap-1">
                        <div className="w-full">
                            <InputControlTracked id="invite-link-create-expires-at" label="Expires At" type="datetime-local" name="expires_at" value={expiresAt} onChange={(e: FormEvent<HTMLFormElement>) => setExpiresAt(e.currentTarget.value)} />
                        </div>
                        {expiresAt &&
                            <Button type="primary" button="button" slot="Clear" display="mb-3 w-12" onClick={() => setExpiresAt('')} />
                        }
                    </div>

                    <div className="flex gap-1 items-center mb-3">
                        <p className="text-sm text-gray-500">
                            Current Expires At:
                        </p>
                        <p className="text-md">
                            {linkEdit?.expires_at || 'Never'}
                        </p>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Button type="primary" button="submit" slot={
                            <span>{isLoading ? <Spinner isLoading={isLoading} width="2em" fill="white" /> : "Update"}</span>
                        } />
                    </div>
                </form>
            </div>
        } />
    );
};

export default RoomInviteLinkUpdate;
