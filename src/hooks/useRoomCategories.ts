import { useEffect, useState } from "react";
import RoomService from "../services/roomService";
import RoomCategory from "../models/room_category";

/**
 * @interface UseRoomCategories
 * @description The room categories hook interface
 */
interface UseRoomCategories {
    categories: RoomCategory[];
    setCategories: (categories: RoomCategory[]) => void;
    error: string;
    isLoading: boolean;
}

/**
 * @function useRoomCategories
 * @description The room categories hook
 * @returns {UseRoomCategories} The room categories hook
 */
const useRoomCategories = (): UseRoomCategories => {
    const [categories, setCategories] = useState<RoomCategory[]>([]);
    const [error, setError] = useState("");
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        RoomService.roomCategories()
            .then(setCategories)
            .catch((err: unknown) => {
                if (err instanceof Error) setError(err.message);
                else setError("An unknown error occurred");
            })
            .finally(() => setLoading(false));

        return () => { }
    }, []);

    return {
        categories,
        setCategories,
        error,
        isLoading,
    };
}

export default useRoomCategories;
