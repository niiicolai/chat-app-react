import { useEffect, useState } from "react";
import Room from "../models/room";
import RoomService from "../services/roomService";
import UserService from "../services/userService";

const useRooms = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [error, setError] = useState("");
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        if (UserService.isAuthenticated()) {
            setLoading(true);
            RoomService.findAll()
                .then(setRooms)
                .catch((err: any) => setError(err.message))
                .finally(() => setLoading(false));
        }

        return () => { }
    }, []);

    return {
        rooms,
        setRooms,
        error,
        isLoading,
    };
}

export default useRooms;
