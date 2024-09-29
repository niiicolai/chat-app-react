import { useEffect, useState, useContext } from "react";
import { RoomContext } from "../context/roomContext";
import RoomUserService from "../services/roomUserService";
import RoomUser from "../models/room_user";

/**
 * @interface UseRoomUsers
 * @description The room users hook interface
 */
interface UseRoomUsers {
    roomUsers: RoomUser[];
    setRoomUsers: (roomUsers: RoomUser[]) => void;
    error: string;
    isLoading: boolean;
    total: number;
}

/**
 * @function useRoomUsers
 * @description The room users hook
 * @returns {UseRoomUsers} The room users hook
 */
const useRoomUsers = (): UseRoomUsers => {
    const { selectedRoom } = useContext(RoomContext);
    const [total, setTotal] = useState(0);
    const [roomUsers, setRoomUsers] = useState<RoomUser[]>([]);
    const [error, setError] = useState("");
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        if (!selectedRoom) return;

        setLoading(true);
        RoomUserService.findAll(selectedRoom.uuid)
            .then(({ data, total }: { data: RoomUser[], total: number }) => {
                setRoomUsers(data);
                setTotal(total);
                setError("");
            })
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
        total
    };
}

export default useRoomUsers;
