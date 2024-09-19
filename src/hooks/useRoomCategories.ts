import { useEffect, useState } from "react";
import RoomService from "../services/roomService";
import RoomCategory from "../models/room_category";

const useRoomCategories = () => {
    const [categories, setCategories] = useState<RoomCategory[]>([]);

    useEffect(() => {
        RoomService.roomCategories()
            .then(setCategories)
            .catch((err: any) => console.error(err.message));

        return () => { }
    }, []);

    return {
        categories,
    };
}

export default useRoomCategories;
