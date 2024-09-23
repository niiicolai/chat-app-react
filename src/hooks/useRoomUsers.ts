import { useEffect, useState, useContext } from "react";
import { RoomContext } from "../context/roomContext";
import RoomUserService from "../services/roomUserService";
import RoomUser from "../models/room_user";

const useRoomUser = () => {
    const { selectedRoom } = useContext(RoomContext);
    const [roomUsers, setRoomUsers] = useState<RoomUser[]>([]);
    const [error, setError] = useState("");
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        if (!selectedRoom) return;

        setLoading(true);
        RoomUserService.findAll(selectedRoom.uuid)
            .then(setRoomUsers)
            .catch((err: any) => setError(err.message))
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

export default useRoomUser;
