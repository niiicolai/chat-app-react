import InputControlTracked from "../utils/InputControlTracked";
import Button from "../utils/Button";
import Modal from "../utils/Modal";
import Spinner from "../utils/Spinner";
import Alert from "../utils/Alert";
import { v4 as uuidv4 } from "uuid";
import { useState, useContext, JSX, FormEvent } from "react";
import { RoomContext } from "../../context/roomContext";

/**
 * @interface RoomInviteLinkCreateProps
 * @description The props for the RoomInviteLinkCreate component
 */
interface RoomInviteLinkCreateProps {
    showLinkCreate: boolean;
    setShowLinkCreate: (show: boolean) => void;
    create: (e: FormEvent<HTMLFormElement>) => Promise<void>;
}

/**
 * @function RoomInviteLinkCreate
 * @param {RoomInviteLinkCreateProps} props
 * @returns {JSX.Element}
 */
const RoomInviteLinkCreate = (props: RoomInviteLinkCreateProps): JSX.Element => {
    const { selectedRoom } = useContext(RoomContext);
    const { showLinkCreate, setShowLinkCreate, create } = props;
    const [uuid, setUuid] = useState(uuidv4());
    const [expiresAt, setExpiresAt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const expiredAtHandler = (e: FormEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setExpiresAt(e.currentTarget.value);
    }

    const submitHandler = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        
        create(e).then(() => {
            setUuid(uuidv4());
            setExpiresAt('');
            setShowLinkCreate(false);
        }).catch((err: unknown) => {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred");
            }
        }).finally(() => {
            setIsLoading(false);
        });
    }

    return (
        <Modal title="Create Invite Link" show={showLinkCreate} setShow={setShowLinkCreate} slot={
            <div>
                <Alert type="error" message={error} />

                <p className="text-md mb-3">
                    Enter the details to create a shareable invite link for your room.
                </p>

                <form onSubmit={submitHandler}>
                    <input type="hidden" name="uuid" value={uuid} />
                    <input type="hidden" name="room_uuid" value={selectedRoom?.uuid} />

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
                        <Button type="primary" button="submit" slot={
                            <span>
                                {isLoading 
                                    ? <Spinner isLoading={isLoading} width="2em" fill="white" /> 
                                    : "Create"
                                }
                            </span>
                        } />
                    </div>
                </form>
            </div>
        } />
    );
};

export default RoomInviteLinkCreate;
