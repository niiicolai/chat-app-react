import { useEffect, useState, useContext } from "react";
import { RoomContext } from "../context/roomContext";
import RoomUserService from "../services/roomUserService";
import RoomUser from "../models/room_user";

/**
 * @interface UseRoomUser
 * @description The room user hook interface
 */
interface UseRoomUsers {
    roomUsers: RoomUser[];
    setRoomUsers: (roomUsers: RoomUser[]) => void;
    error: string;
    isLoading: boolean;
}

/**
 * @function useRoomUsers
 * @description The room user hook
 * @returns {UseRoomUsers} The room user hook
 */
const useRoomUsers = (): UseRoomUsers => {
    const { selectedRoom } = useContext(RoomContext);
    const [roomUsers, setRoomUsers] = useState<RoomUser[]>([]);
    const [error, setError] = useState("");
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        if (!selectedRoom) return;

        setLoading(true);
        RoomUserService.findAll(selectedRoom.uuid)
            .then(setRoomUsers)
            .catch((err: unknown) => {
                if (err instanceof Error) setError(err.message);
                else setError("An unknown error occurred");
            })
            .finally(() => setLoading(false));

        return () => { }
    }, [selectedRoom]);

    return {
        roomUsers,
        setRoomUsers,
        isLoading,
        error,
    };
}

export default useRoomUsers;
