
import RoomInviteLinkMain from "../room_invite_link/RoomInviteLinkMain";
import ChannelWebhookMain from "../channel_webhook/ChannelWebhookMain";
import RoomSettingUpdate from "../room_setting/RoomSettingUpdate";
import RoomUserList from "../room_user/RoomUserList";
import RoomFileList from "../room_file/RoomFileList";
import ChannelCreate from "../channel/ChannelCreate";
import RoomUpdate from "./RoomUpdate";
import RoomDelete from "./RoomDelete";
import RoomLeave from "./RoomLeave";
import Room from "../../models/room";

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

import { useContext, useState } from "react";
import { RoomContext } from "../../context/roomContext";
import { JSX } from "react";

/**
 * @function RoomOptions
 * @returns {JSX.Element}
 */
const RoomOptions = (): JSX.Element => {
    const [editRoom, setEditRoom] = useState<Room | null>(null);
    const [editSettings, setEditSettings] = useState<Room | null>(null);
    const [showCreateChannel, setShowCreateChannel] = useState(false);
    const [showDeleteRoom, setShowDeleteRoom] = useState(false);
    const [showLeaveRoom, setShowLeaveRoom] = useState(false);
    const [showWebhooks, setShowWebhooks] = useState(false);
    const [showUsers, setShowUsers] = useState(false);
    const [showFiles, setShowFiles] = useState(false);
    const [showLinks, setShowLinks] = useState(false);
    const { selectedRoom, selectedRoomUser } = useContext(RoomContext);
    const canModify = selectedRoomUser?.room_user_role_name === 'Admin';

    const roomOptions = [
        { title: 'Create Channel', icon: <PlusIcon fill="white" width="1em" />, onClick: () => setShowCreateChannel(!showCreateChannel), type: 'primary', requirePermission: true, testId: 'room-options-create-channel' },
        { title: 'Users', icon: <UsersIcon fill="white" width="1.2em" />, onClick: () => setShowUsers(!showUsers), type: 'primary', requirePermission: false, testId: 'room-options-users' },
        { title: 'Files', icon: <FileIcon fill="white" width="1em" />, onClick: () => setShowFiles(!showFiles), type: 'primary', requirePermission: false, testId: 'room-options-files' },
        { title: 'Invite Links', icon: <LinkIcon fill="white" width="1.2em" />, onClick: () => setShowLinks(!showLinks), type: 'primary', requirePermission: false, testId: 'room-options-invite-links' },
        { title: 'Webhooks', icon: <BotIcon fill="white" width="1.2em" />, onClick: () => setShowWebhooks(!showWebhooks), type: 'primary', requirePermission: true, testId: 'room-options-webhooks' },
        { title: 'Room Settings', icon: <GearIcon fill="white" width="1em" />, onClick: () => setEditSettings(editSettings ? null : selectedRoom), type: 'primary', requirePermission: true, testId: 'room-options-room-settings' },
        { title: 'Edit Room', icon: <PenIcon fill="white" width="1em" />, onClick: () => setEditRoom(editRoom ? null : selectedRoom), type: 'primary', requirePermission: true, testId: 'room-options-edit-room' },
        { title: 'Delete Room', icon: <TrashIcon fill="white" width=".8em " />, onClick: () => setShowDeleteRoom(!showCreateChannel), type: 'error', requirePermission: true, testId: 'room-options-delete-room' },
        { title: 'Leave Room', icon: <DoorIcon fill="white" width="1em" />, onClick: () => setShowLeaveRoom(!showLeaveRoom), type: 'error', requirePermission: false, testId: 'room-options-leave-room' }
    ]

    return (
        <div>
            <RoomLeave showLeaveRoom={showLeaveRoom} setShowLeaveRoom={setShowLeaveRoom} />
            <RoomDelete showDeleteRoom={showDeleteRoom} setShowDeleteRoom={setShowDeleteRoom} />
            <RoomUpdate editRoom={editRoom} setEditRoom={setEditRoom} />
            <RoomFileList showFiles={showFiles} setShowFiles={setShowFiles} />
            <RoomInviteLinkMain showLinks={showLinks} setShowLinks={setShowLinks} />
            <ChannelWebhookMain showWebhooks={showWebhooks} setShowWebhooks={setShowWebhooks} />
            <RoomSettingUpdate editSettings={editSettings} setEditSettings={setEditSettings} />
            <RoomUserList showUsers={showUsers} setShowUsers={setShowUsers} />
            <ChannelCreate showCreateChannel={showCreateChannel} setShowCreateChannel={setShowCreateChannel} />

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

export default RoomOptions;
