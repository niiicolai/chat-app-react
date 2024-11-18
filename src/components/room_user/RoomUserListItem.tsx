
import RoomUser from "../../models/room_user";
import Avatar from "../utils/Avatar";
import Button from "../utils/Button";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import { JSX } from "react";

/**
 * @interface RoomUserListItemProps
 * @description The props for the RoomUserListItem component
 */
interface RoomUserListItemProps {
    roomUser: RoomUser;
    update: (uuid: string, room_user_role_name: string) => void;
    destroy: (uuid: string) => void;
    isAdmin: boolean;
    isMod: boolean;
}

/**
 * @function RoomUserListItem
 * @param {RoomUserListItemProps} props
 * @returns {JSX.Element}
 */
const RoomUserListItem = (props: RoomUserListItemProps): JSX.Element => {
    const { roomUser, update, destroy, isAdmin, isMod } = props;
    const { user } = useContext(UserContext);
    const isMe = user?.uuid === roomUser.user.uuid;

    return (
        <li className="border border-gray-800 rounded-md p-3" data-testid="room-user-list-item">
            <div className="flex items-start gap-3 border border-gray-800 rounded-md p-3 mb-3">
                <div>
                    <Avatar src={roomUser.user.avatar_src} alternativeName={roomUser.user.username} />
                </div>
                <div>
                    <p className="text-white mb-1" data-testid="room-user-li-username">{roomUser.user.username}</p>
                    <p className="text-gray-400 text-xs" data-testid="room-user-li-role-name">{roomUser.room_user_role_name}</p>
                </div>
            </div>
            { !isMe &&
                <div className="bg-gray-700 p-2 rounded-md flex flex-col gap-1">
                    <Button type="primary" display={`${isAdmin?'':'hidden'} flex items-center justify-center`} title="Promote to Admin" onClick={() => update(roomUser.uuid, 'Admin')} button="button" slot="Set Admin" testId="set-room-user-admin" />
                    <Button type="primary" display={`${isAdmin?'':'hidden'} flex items-center justify-center`} title="Promote to Moderator" onClick={() => update(roomUser.uuid, 'Moderator')} button="button" slot="Set Moderator" testId="set-room-user-mod" />
                    <Button type="primary" display={`${isAdmin?'':'hidden'} flex items-center justify-center`} title="Promote to Member" onClick={() => update(roomUser.uuid, 'Member')} button="button" slot="Set Member" testId="set-room-user-member" />
                    <Button type="error" display={`${isAdmin||isMod?'':'hidden'} flex items-center justify-center`} button="button" title="Kick" onClick={() => destroy(roomUser.uuid)}  slot="Kick" testId="kick-room-user" />
                </div>
            }
            { isMe &&
                <div className="bg-gray-700 p-2 rounded-md flex flex-col gap-1 text-center">
                    You
                </div>
            }
        </li>
    );
};

export default RoomUserListItem;
