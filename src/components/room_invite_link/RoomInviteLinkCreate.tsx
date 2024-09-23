import InputControlTracked from "../utils/InputControlTracked";
import Button from "../utils/Button";
import Modal from "../utils/Modal";
import Spinner from "../utils/Spinner";
import Alert from "../utils/Alert";
import { v4 as uuidv4 } from "uuid";
import { useState, useContext } from "react";
import { RoomContext } from "../../context/roomContext";

interface RoomInviteLinkCreateProps {
    showLinkCreate: boolean;
    setShowLinkCreate: (show: boolean) => void;
    create: (e: any) => Promise<void>;
}
const RoomInviteLinkCreate = (props: RoomInviteLinkCreateProps) => {
    const { selectedRoom } = useContext(RoomContext);
    const { showLinkCreate, setShowLinkCreate, create } = props;
    const [ uuid, setUuid ] = useState(uuidv4());
    const [ expiresAt, setExpiresAt ] = useState('');

    const submitHandler = (e: any) => {
        create(e).then(() => {
            setUuid(uuidv4());
            setExpiresAt('');
        });
    }

    return (
        <Modal title="Create Invite Link" show={showLinkCreate} setShow={setShowLinkCreate} slot={
            <div>
                <p className="text-md mb-3">
                    Enter the details to create a shareable invite link for your room.
                </p>

                <form onSubmit={submitHandler}>
                    <input type="hidden" name="uuid" value={uuid} />
                    <input type="hidden" name="room_uuid" value={selectedRoom?.uuid} />

                    <div className="flex gap-1">
                        <div className="w-full">
                            <InputControlTracked id="invite-link-create-expires-at" label="Expires At" type="datetime-local" name="expires_at" value={expiresAt} onChange={(e: any) => setExpiresAt(e.target.value)} />
                        </div>
                        {expiresAt &&
                            <Button type="primary" button="button" slot="Clear" display="mb-3 w-12" onClick={() => setExpiresAt('')} />
                        }
                    </div>

                    <div className="flex flex-col gap-2">
                        <Button type="primary" button="submit" slot="Create" />
                    </div>
                </form>
            </div>
        } />
    );
};

export default RoomInviteLinkCreate;
