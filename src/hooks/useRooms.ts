import { useEffect, useState } from "react";
import Room from "../models/room";
import RoomService from "../services/roomService";
import UserService from "../services/userService";

/**
 * @interface UseRooms
 * @description The room hook interface
 */
interface UseRooms {
    rooms: Room[];
    setRooms: (rooms: Room[]) => void;
    error: string;
    isLoading: boolean;
}

/**
 * @function useRooms
 * @description The room hook
 * @returns {UseRoom} The room hook
 */
const useRooms = (): UseRooms => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [error, setError] = useState("");
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        if (UserService.isAuthenticated()) {
            setLoading(true);
            RoomService.findAll()
                .then(setRooms)
                .catch((err: unknown) => {
                    if (err instanceof Error) setError(err.message);
                    else setError("An unknown error occurred");
                })
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
