
import RoomInviteLinkMain from "../room_invite_link/RoomInviteLinkMain";
import ChannelWebhookMain from "../channel_webhook/ChannelWebhookMain";
import RoomSettingUpdate from "../room_setting/RoomSettingUpdate";
import RoomUserList from "../room_user/RoomUserList";
import RoomFileList from "../room_file/RoomFileList";
import ChannelCreate from "../channel/ChannelCreate";
import RoomService from "../../services/roomService";
import RoomUpdate from "./RoomUpdate";
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
import { ToastContext } from "../../context/toastContext";
import { ReactNode } from "react";

/**
 * @function RoomOptions
 * @returns {ReactNode}
 */
const RoomOptions = (): ReactNode => {
    const [editRoom, setEditRoom] = useState<Room | null>(null);
    const [editSettings, setEditSettings] = useState<Room | null>(null);
    const [showWebhooks, setShowWebhooks] = useState(false);
    const [showCreateChannel, setShowCreateChannel] = useState(false);
    const [showUsers, setShowUsers] = useState(false);
    const [showFiles, setShowFiles] = useState(false);
    const [showLinks, setShowLinks] = useState(false);
    const { selectedRoom, setSelectedRoom, rooms, setRooms } = useContext(RoomContext);
    const { addToast } = useContext(ToastContext);

    const destroyRoom = async (uuid: string | undefined) => {
        if (!uuid) return;
        try {
            await RoomService.destroy(uuid);
            setRooms(rooms.filter((r) => r.uuid !== uuid));
            if (selectedRoom?.uuid === uuid) {
                setSelectedRoom(null);
            }
            addToast({ message: 'Room deleted', type: 'success', duration: 5000 });
        } catch (err: unknown) {
            if (err instanceof Error) {
                addToast({ message: err.message, type: 'error', duration: 5000 });
            } else {
                addToast({ message: 'An unknown error occurred', type: 'error', duration: 5000 });
            }
        }
    }

    const leaveRoom = async (uuid: string | undefined) => {
        if (!uuid) return;
        try {
            await RoomService.leave(uuid);
            setRooms(rooms.filter((r) => r.uuid !== uuid));
            if (selectedRoom?.uuid === uuid) {
                setSelectedRoom(null);
            }
            addToast({ message: 'Room left', type: 'success', duration: 5000 });
        } catch (err: unknown) {
            if (err instanceof Error) {
                addToast({ message: err.message, type: 'error', duration: 5000 });
            } else {
                addToast({ message: 'An unknown error occurred', type: 'error', duration: 5000 });
            }
        }
    }

    const roomOptions = [
        { title: 'Create Channel', icon: <PlusIcon fill="white" width="1em" />, onClick: () => setShowCreateChannel(!showCreateChannel), type: 'primary' },
        { title: 'Users', icon: <UsersIcon fill="white" width="1.2em" />, onClick: () => setShowUsers(!showUsers), type: 'primary' },
        { title: 'Files', icon: <FileIcon fill="white" width="1em" />, onClick: () => setShowFiles(!showFiles), type: 'primary' },
        { title: 'Invite Links', icon: <LinkIcon fill="white" width="1.2em" />, onClick: () => setShowLinks(!showLinks), type: 'primary' },
        { title: 'Webhooks', icon: <BotIcon fill="white" width="1.2em" />, onClick: () => setShowWebhooks(!showWebhooks), type: 'primary' },
        { title: 'Room Settings', icon: <GearIcon fill="white" width="1em" />, onClick: () => setEditSettings(editSettings ? null : selectedRoom), type: 'primary' },
        { title: 'Edit Room', icon: <PenIcon fill="white" width="1em" />, onClick: () => setEditRoom(editRoom ? null : selectedRoom), type: 'primary' },
        { title: 'Delete Room', icon: <TrashIcon fill="white" width=".8em " />, onClick: () => destroyRoom(selectedRoom?.uuid), type: 'error' },
        { title: 'Leave Room', icon: <DoorIcon fill="white" width="1em" />, onClick: () => leaveRoom(selectedRoom?.uuid), type: 'error' },
    ]
    return (
        <div>
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
                            <Button key={index} type={option.type} title={option.title}
                                display="w-8 h-8 flex items-center justify-center"
                                onClick={option.onClick}
                                slot={option.icon}
                            />
                        ))}
                    </div>
                }
            />
        </div>
    );
};

export default RoomOptions;
