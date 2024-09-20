import useRooms from "../../hooks/useRooms";
import InputControl from "../utils/InputControl";
import Button from "../utils/Button";
import Modal from "../utils/Modal";

const RoomSettingUpdate = (props: any) => {
    const { editSettings, setEditSettings } = props;
    const { error, isLoading, update } = useRooms();

    return (
        <Modal title="Update Settings" show={editSettings} setShow={setEditSettings} slot={
            <div>

                <p className="text-md mb-3">
                    Enter the details to update a room setting
                </p>

                {error && <p className="text-danger">{error}</p>}
                {isLoading && <div className="spinner-border"></div>}
                {editSettings && (
                    <form onSubmit={update} className="text-white">
                        <input type="hidden" name="uuid" value={setEditSettings.uuid} />
                        <InputControl id="join_channel_uuid" type="text" label="Join Channel UUID" name="join_channel_uuid" defaultValue={editSettings.joinSettings.channelUuid} />
                        <InputControl id="join_message" type="text" label="Join Message" name="join_message" defaultValue={editSettings.joinSettings.message} />
                        <InputControl id="rules_text" type="text" label="Rules Text" name="rules_text" defaultValue={editSettings.rulesSettings.text} />
                        
                        <div className="flex flex-col gap-2">
                            <Button type="primary" button="submit" slot="Update" />
                            <Button type="secondary" button="button" slot="Cancel" onClick={() => setEditSettings(null)} />
                        </div>
                    </form>
                )}
            </div>
        } />
    );
};

export default RoomSettingUpdate;
