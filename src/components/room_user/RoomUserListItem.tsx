
import RoomUser from "../../models/room_user";
import Avatar from "../utils/Avatar";
import Button from "../utils/Button";
import Spinner from "../utils/Spinner";
import Alert from "../utils/Alert";
import { useContext } from "react";
import { ToastContext } from "../../context/toastContext";
import { JSX } from "react";
import { useUpdateRoomUser, useDestroyRoomUser } from "../../hooks/useRoomUsers";

/**
 * @interface RoomUserListItemProps
 * @description The props for the RoomUserListItem component
 */
interface RoomUserListItemProps {
    roomUser: RoomUser;
    authRoomUser: RoomUser | undefined;
    refetch: () => void;
}

/**
 * @function RoomUserListItem
 * @param {RoomUserListItemProps} props
 * @returns {JSX.Element}
 */
const RoomUserListItem = (props: RoomUserListItemProps): JSX.Element => {
    const { roomUser, authRoomUser, refetch } = props;
    const { addToast } = useContext(ToastContext);
    const updateRoomUser = useUpdateRoomUser(roomUser.uuid);
    const destroyRoomUser = useDestroyRoomUser(roomUser.uuid);
    const isLoading = updateRoomUser.isLoading || destroyRoomUser.isLoading;
    const error = updateRoomUser.error || destroyRoomUser.error;
    const isAdmin = authRoomUser?.room_user_role_name === 'Admin';
    const isMod = authRoomUser?.room_user_role_name === 'Moderator';
    const isMe = roomUser?.uuid === authRoomUser?.user.uuid;

    const updateHandler = async (uuid: string, role: string) => {
        try {
            await updateRoomUser.mutateAsync({ uuid, room_user_role_name: role });
            addToast({ message: 'User role updated', type: 'success', duration: 5000 });
            refetch();
        } catch {
            addToast({ message: 'Error updating user role', type: 'error', duration: 5000 });
        }
    }

    const destroyHandler = async (uuid: string) => {
        try {
            await destroyRoomUser.mutateAsync(uuid);
            addToast({ message: 'User kicked', type: 'success', duration: 5000 });
            refetch();
        } catch {
            addToast({ message: 'Error kicking user', type: 'error', duration: 5000 });
        }
    }

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

            <Alert type="error" message={error} />

            {isLoading &&
                <div className="flex items-center justify-center">
                    <Spinner isLoading={isLoading} width="2em" fill="white" />
                </div>
            }

            {!isMe && !isLoading &&
                <div className="bg-gray-700 p-2 rounded-md flex flex-col gap-1">
                    <Button type="primary" display={`${isAdmin ? '' : 'hidden'} flex items-center justify-center`} title="Promote to Admin" onClick={() => updateHandler(roomUser.uuid, 'Admin')} button="button" slot="Set Admin" testId="set-room-user-admin" />
                    <Button type="primary" display={`${isAdmin ? '' : 'hidden'} flex items-center justify-center`} title="Promote to Moderator" onClick={() => updateHandler(roomUser.uuid, 'Moderator')} button="button" slot="Set Moderator" testId="set-room-user-mod" />
                    <Button type="primary" display={`${isAdmin ? '' : 'hidden'} flex items-center justify-center`} title="Promote to Member" onClick={() => updateHandler(roomUser.uuid, 'Member')} button="button" slot="Set Member" testId="set-room-user-member" />
                    <Button type="error" display={`${isAdmin || isMod ? '' : 'hidden'} flex items-center justify-center`} button="button" title="Kick" onClick={() => destroyHandler(roomUser.uuid)} slot="Kick" testId="kick-room-user" />
                </div>
            }
            {isMe &&
                <div className="bg-gray-700 p-2 rounded-md flex flex-col gap-1 text-center">
                    You
                </div>
            }
        </li>
    );
};

export default RoomUserListItem;
