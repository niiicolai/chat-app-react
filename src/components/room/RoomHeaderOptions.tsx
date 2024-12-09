import TrashIcon from "../icons/TrashIcon";
import UsersIcon from "../icons/UsersIcon";
import PlusIcon from "../icons/PlusIcon";
import LinkIcon from "../icons/LinkIcon";
import FileIcon from "../icons/FileIcon";
import GearIcon from "../icons/GearIcon";
import BotIcon from "../icons/BotIcon";
import PenIcon from "../icons/PenIcon";
import DoorIcon from "../icons/DoorIcon";
import Button from "../utils/Button";
import ResMenu from "../utils/ResMenu";
import Room from "../../models/room";
import { useNavigate } from "react-router-dom";
import { JSX } from "react";
import { useGetAuthenticatedRoomUser } from "../../hooks/useRoomUsers";

/**
 * @interface RoomHeaderOptionsProps
 * @description The props for the RoomHeaderOptions component
 */
interface RoomHeaderOptionsProps {
    room: Room;
}

/**
 * @function RoomOptions
 * @returns {JSX.Element}
 */
const RoomHeaderOptions = (props: RoomHeaderOptionsProps): JSX.Element => {
    const navigate = useNavigate();
    const { room } = props;
    const { data: selectedRoomUser } = useGetAuthenticatedRoomUser(room.uuid);
    const canModify = selectedRoomUser?.room_user_role_name === 'Admin';
    const room_uuid = room.uuid;

    const roomOptions = [
        { title: 'Create Channel', icon: <PlusIcon fill="white" width="1em" />, onClick: () => navigate(`/room/${room_uuid}/channel/create`), type: 'primary', requirePermission: true, testId: 'room-options-create-channel' },
        { title: 'Users', icon: <UsersIcon fill="white" width="1.2em" />, onClick: () => navigate(`/room/${room_uuid}/users`), type: 'primary', requirePermission: false, testId: 'room-options-users' },
        { title: 'Files', icon: <FileIcon fill="white" width="1em" />, onClick: () => navigate(`/room/${room_uuid}/files`), type: 'primary', requirePermission: false, testId: 'room-options-files' },
        { title: 'Invite Links', icon: <LinkIcon fill="white" width="1.2em" />, onClick: () => navigate(`/room/${room_uuid}/links`), type: 'primary', requirePermission: false, testId: 'room-options-invite-links' },
        { title: 'Webhooks', icon: <BotIcon fill="white" width="1.2em" />, onClick: () => navigate(`/room/${room_uuid}/webhooks`), type: 'primary', requirePermission: true, testId: 'room-options-webhooks' },
        { title: 'Room Settings', icon: <GearIcon fill="white" width="1em" />, onClick: () => navigate(`/room/${room_uuid}/settings/edit`), type: 'primary', requirePermission: true, testId: 'room-options-room-settings' },
        { title: 'Edit Room', icon: <PenIcon fill="white" width="1em" />, onClick: () => navigate(`/room/${room_uuid}/edit`), type: 'primary', requirePermission: true, testId: 'room-options-edit-room' },
        { title: 'Delete Room', icon: <TrashIcon fill="white" width=".8em " />, onClick: () => navigate(`/room/${room_uuid}/delete`), type: 'error', requirePermission: true, testId: 'room-options-delete-room' },
        { title: 'Leave Room', icon: <DoorIcon fill="white" width="1em" />, onClick: () => navigate(`/room/${room_uuid}/leave`), type: 'error', requirePermission: false, testId: 'room-options-leave-room' }
    ]

    return (
        <div>
            <ResMenu
                type="primary"
                title="Room Options"
                stickDirection="right-0"
                slot={
                    <div className="flex flex-col sm:flex-row p-3 sm:p-0 gap-2">
                        {roomOptions.map((option, index) => (
                            <Button key={index} 
                                type={option.type} 
                                title={option.title}
                                onClick={option.onClick}
                                slot={option.icon}
                                testId={option.testId}
                                display={`w-8 h-8 flex items-center justify-center ${canModify || !option.requirePermission ? '' : 'hidden'} ${option.title === 'Leave Room' && canModify ? 'hidden' : ''}`}                                
                            />
                        ))}
                    </div>
                }
            />
        </div>
    );
};

export default RoomHeaderOptions;
