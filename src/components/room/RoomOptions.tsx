
import RoomInviteLinkList from "../room_invite_link/RoomInviteLinkList";
import ChannelWebhookList from "../channel_webhook/ChannelWebhookList";
import RoomSettingUpdate from "../room_setting/RoomSettingUpdate";
import RoomUserList from "../room_user/RoomUserList";
import RoomFileList from "../room_file/RoomFileList";
import ChannelCreate from "../channel/ChannelCreate";

import TrashIcon from "../icons/TrashIcon";
import UsersIcon from "../icons/UsersIcon";
import PlusIcon from "../icons/PlusIcon";
import LinkIcon from "../icons/LinkIcon";
import FileIcon from "../icons/FileIcon";
import GearIcon from "../icons/GearIcon";
import BotIcon from "../icons/BotIcon";
import PenIcon from "../icons/PenIcon";
import Button from "../utils/Button";
import ResMenu from "../utils/ResMenu";

import Room from "../../models/room";
import RoomUpdate from "./RoomUpdate";
import useRooms from "../../hooks/useRooms";
import { useContext, useState } from "react";
import { RoomContext } from "../../context/roomContext";

const RoomOptions = () => {
    const [editRoom, setEditRoom] = useState<Room | null>(null);
    const [editSettings, setEditSettings] = useState<Room | null>(null);
    const [showWebhooks, setShowWebhooks] = useState(false);
    const [createChannel, setCreateChannel] = useState(false);
    const [showUsers, setShowUsers] = useState(false);
    const [showFiles, setShowFiles] = useState(false);
    const [showLinks, setShowLinks] = useState(false);
    const { room } = useContext(RoomContext);
    const { destroy } = useRooms();
    const roomOptions = [
        { title: 'Create Channel', icon: <PlusIcon fill="white" width="1em" />, onClick: () => setCreateChannel(!createChannel), type: 'primary' },
        { title: 'Users', icon: <UsersIcon fill="white" width="1.2em" />, onClick: () => setShowUsers(!showUsers), type: 'primary' },
        { title: 'Files', icon: <FileIcon fill="white" width="1em" />, onClick: () => setShowFiles(!showFiles), type: 'primary' },
        { title: 'Invite Links', icon: <LinkIcon fill="white" width="1.2em" />, onClick: () => setShowLinks(!showLinks), type: 'primary' },
        { title: 'Webhooks', icon: <BotIcon fill="white" width="1.2em" />, onClick: () => setShowWebhooks(!showWebhooks), type: 'primary' },
        { title: 'Room Settings', icon: <GearIcon fill="white" width="1em" />, onClick: () => setEditSettings(editSettings ? null : room), type: 'primary' },
        { title: 'Edit Room', icon: <PenIcon fill="white" width="1em" />, onClick: () => setEditRoom(editRoom ? null : room), type: 'primary' },
        { title: 'Delete Room', icon: <TrashIcon fill="white" width=".8em " />, onClick: () => destroy(room?.uuid), type: 'error' },
    ]
    return (
        <div>
            <RoomUpdate editRoom={editRoom} setEditRoom={setEditRoom} />
            <RoomFileList showFiles={showFiles} setShowFiles={setShowFiles} />
            <RoomInviteLinkList showLinks={showLinks} setShowLinks={setShowLinks} />
            <ChannelWebhookList showWebhooks={showWebhooks} setShowWebhooks={setShowWebhooks} />
            <RoomSettingUpdate editSettings={editSettings} setEditSettings={setEditSettings} />
            <RoomUserList showUsers={showUsers} setShowUsers={setShowUsers} />
            <ChannelCreate createChannel={createChannel} setCreateChannel={setCreateChannel} />

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
