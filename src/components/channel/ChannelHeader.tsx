import { useContext, useState, JSX } from "react";
import { ChannelContext } from "../../context/channelContext";
import { RoomContext } from "../../context/roomContext";
import TrashIcon from "../icons/TrashIcon";
import PenIcon from "../icons/PenIcon";
import Button from "../utils/Button";
import ChannelDelete from "./ChannelDelete";
import Channel from "../../models/channel";

/**
 * @interface ChannelHeaderProps
 * @description The props for the ChannelHeader component
 */
interface ChannelHeaderProps {
    setEditChannel: (channel: Channel | null) => void;
}

/**
 * @function ChannelHeader
 * @param {ChannelHeaderProps} props
 * @returns {JSX.Element}
 */
const ChannelHeader = (props: ChannelHeaderProps): JSX.Element => {
    const { setEditChannel } = props;
    const { selectedRoomUser } = useContext(RoomContext);
    const { selectedChannel } = useContext(ChannelContext);
    const [ showSettings, setShowSettings ] = useState(false);
    const [ showDeleteChannel, setShowDeleteChannel ] = useState(false);
    const onMouseEnter = () => setShowSettings(true);
    const onMouseLeave = () => setShowSettings(false);
    const isAdmin = selectedRoomUser?.room_user_role_name === 'Admin';

    return (
        <div className="border-b border-gray-800 flex items-center justify-between gap-3 p-3 relative" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} data-testid="channel-header">
            <ChannelDelete showDeleteChannel={showDeleteChannel} setShowDeleteChannel={setShowDeleteChannel} />

            {selectedChannel && <p className="text-sm text-white" data-testid="channel-header-description">{selectedChannel.description}</p>}

            {showSettings && isAdmin &&
                <div className="bg-gray-800 p-1 rounded-md absolute right-3 flex gap-2" style={{ top: '50%', transform: 'translateY(-50%)' }}>
                    <Button type="primary" display="h-5 w-5 flex items-center justify-center" button="button" title="Edit Channel" testId="channel-header-edit-channel" onClick={() => setEditChannel(selectedChannel)} slot={
                        <PenIcon fill="white" width=".6em" />
                    } />
                    <Button type="error" display="h-5 w-5 flex items-center justify-center" button="button" title="Delete Channel" testId="channel-header-delete-channel" onClick={() => setShowDeleteChannel(true)} slot={
                        <TrashIcon fill="white" width=".6em" />
                    } />
                </div>
            }
        </div>
    );
};

export default ChannelHeader;
