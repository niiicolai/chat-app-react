import { useState } from "react";
import { Room } from "../services/roomService";

const useRoom = () => {
    const [room, setRoom] = useState<Room>();

    return {
        room,
        setRoom,
    };
}

export default useRoom;
