import useRoomUsers from "../../hooks/useRoomUsers";
import Modal from "../utils/Modal";
import { useState } from "react";

const RoomUserList = (props: any) => {
    const { showUsers, setShowUsers } = props;
    const { roomUsers, error, isLoading } = useRoomUsers();
    const [ showUserUpdate, setShowUserUpdate ] = useState(false);
    return (
        <Modal title="Room Users" show={showUsers} setShow={setShowUsers} slot={
            <div>
                <ul className="flex flex-col gap-3 mb-3">
                    {roomUsers.map((roomUser) => (
                        <li key={roomUser.uuid} className="flex flex-col gap-1">
                            <span className="text-white">{roomUser.uuid}</span>
                        </li>
                    ))}
                    {!roomUsers.length && <li className="text-white">No room users found</li>}
                </ul>
            </div>
        } />
    );
};

export default RoomUserList;
