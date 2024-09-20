import useRooms from "../../hooks/useRooms";
import InputControl from "../utils/InputControl";
import Button from "../utils/Button";
import Modal from "../utils/Modal";
import Spinner from "../utils/Spinner";
import Alert from "../utils/Alert";
import { v4 as uuidv4 } from "uuid";

const RoomInviteLinkCreate = (props: any) => {
    const { createRoom, setCreateRoom } = props;
    const { error, isLoading, create } = useRooms();
    return (
        <Modal title="Create Invite Link" show={createRoom} setShow={setCreateRoom} slot={
            <div>
                <p className="text-md mb-3">
                    Enter the details to create a shareable invite link for your room.
                </p>

                <Alert message={error} type="error" />
                <Spinner isLoading={isLoading} fill="white" width="16" />

                <form onSubmit={create}>
                    <input type="hidden" name="uuid" value={uuidv4()} />
                    <InputControl id="invite-link-create-expires-at" label="Expires At" type="datetime-local" name="expires_at" />

                    <div className="flex flex-col gap-2">
                        <Button type="primary" button="submit" slot="Create" />
                    </div>
                </form>
            </div>
        } />
    );
};

export default RoomInviteLinkCreate;
