import { useState } from "react";
import Room from "../models/room";

const useRoom = () => {
    const [room, setRoom] = useState<Room>();

    return {
        room,
        setRoom,
    };
}

export default useRoom;
