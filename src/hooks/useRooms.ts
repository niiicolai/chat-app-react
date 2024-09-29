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
    pages: number;
    setPages: (pages: number) => void;
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
    const [pages, setPages] = useState(1);
    const limit = 10;

    useEffect(() => {
        if (UserService.isAuthenticated()) {
            paginate(1, limit);
        }

        return () => { }
    }, []);

    const paginate = async (page: number, limit: number) => {
        setLoading(true);

        try {
            const { data, pages } = await RoomService.findAll(page, limit);
            setRooms(data);
            setPages(pages ?? 1);
            setError("");
        } catch (err: unknown) {
            if (err instanceof Error) setError(err.message);
            else setError("An unknown error occurred");
        } finally {
            setLoading(false);
        }
    }

    return {
        rooms,
        setRooms,
        error,
        isLoading,
        pages,
        setPages,
    };
}

export default useRooms;
