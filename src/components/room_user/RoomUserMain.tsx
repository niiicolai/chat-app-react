import useRoomUsers from "../../hooks/useRoomUsers";
import RoomUserService from "../../services/roomUserService";
import RoomUserList from "./RoomUserList";

interface RoomUserMainProps {
    showUsers: boolean;
    setShowUsers: (show: boolean) => void;
}

const RoomUserMain = (props: RoomUserMainProps) => {
    const { showUsers, setShowUsers } = props;
    const { roomUsers, setRoomUsers, error, isLoading } = useRoomUsers();

    const update = async (uuid: string, room_user_role_name: string) => {
        if (!uuid) return;
        await RoomUserService.update(uuid, { room_user_role_name });
        setRoomUsers((users: any) => users.map((user: any) => {
            if (user.uuid === uuid) {
                user.room_user_role_name = room_user_role_name;
            }
            return user;
        }));
    };

    const destroy = async (uuid: string) => {
        await RoomUserService.destroy(uuid);
        setRoomUsers((users: any) => users.filter((user: any) => user.uuid !== uuid));
    };

    return (
        <div>
            <RoomUserList 
                roomUsers={roomUsers} 
                showUsers={showUsers} 
                setShowUsers={setShowUsers}
                update={update} 
                destroy={destroy} 
            />
        </div>
    );
};

export default RoomUserMain;
