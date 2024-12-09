import { useState, JSX } from "react";
import TrashIcon from "../icons/TrashIcon";
import PenIcon from "../icons/PenIcon";
import Button from "../utils/Button";
import Spinner from "../utils/Spinner";
import Alert from "../utils/Alert";
import Channel from "../../models/channel";
import { useNavigate } from 'react-router-dom';
import { useGetAuthenticatedRoomUser } from "../../hooks/useRoomUsers";

/**
 * @interface ChannelHeaderProps
 * @description The props for the ChannelHeader component
 */
interface ChannelHeaderProps {
    channel: Channel;
}

/**
 * @function ChannelHeader
 * @param {ChannelHeaderProps} props
 * @returns {JSX.Element}
 */
const ChannelHeader = (props: ChannelHeaderProps): JSX.Element => {
    const navigate = useNavigate();
    const { channel } = props;
    const { data: roomUser, isLoading, error } = useGetAuthenticatedRoomUser(channel.room_uuid);
    const [ showSettings, setShowSettings ] = useState(false);
    const isAdmin = roomUser?.room_user_role_name === 'Admin';
    const onMouseEnter = () => setShowSettings(true);
    const onMouseLeave = () => setShowSettings(false);

    return (
        <div className="border-b border-gray-800 flex items-center justify-between gap-3 p-3 relative" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} data-testid="channel-header">
            <Alert type="error" message={error} />

            {isLoading && (
                <Spinner isLoading={isLoading} width="2em" fill="white" />
            )}

            {!isLoading && channel && (
                <p className="text-sm text-white" data-testid="channel-header-description">{channel.description}</p>
            )}

            {!isLoading && showSettings && isAdmin &&
                <div className="bg-gray-800 p-1 rounded-md absolute right-3 flex gap-2" style={{ top: '50%', transform: 'translateY(-50%)' }}>
                    <Button 
                        type="primary" 
                        display="h-5 w-5 flex items-center justify-center" 
                        button="button" 
                        title="Edit Channel" 
                        testId="channel-header-edit-channel" 
                        onClick={() => navigate(`/room/${channel.room_uuid}/channel/${channel.uuid}/edit`)} 
                        slot={
                        <PenIcon fill="white" width=".6em" />
                    } />
                    <Button 
                        type="error" 
                        display="h-5 w-5 flex items-center justify-center" 
                        button="button" 
                        title="Delete Channel" 
                        testId="channel-header-delete-channel" 
                        onClick={() => navigate(`/room/${channel.room_uuid}/channel/${channel.uuid}/delete`)}
                        slot={
                        <TrashIcon fill="white" width=".6em" />
                    } />
                </div>
            }
        </div>
    );
};

export default ChannelHeader;
