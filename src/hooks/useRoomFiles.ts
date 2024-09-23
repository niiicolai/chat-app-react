import RoomFileService from "../services/roomFileService";
import RoomFile from "../models/room_file";
import { useEffect, useState, useContext } from "react";
import { RoomContext } from "../context/roomContext";

const useRoomFiles = () => {
    const { selectedRoom } = useContext(RoomContext);
    const [ files, setFiles ] = useState<RoomFile[]>([]);
    const [ error, setError ] = useState("");
    const [ isLoading, setLoading ] = useState(false);

    useEffect(() => {
        if (!selectedRoom) return;

        setLoading(true);
        
        RoomFileService
            .findAll(selectedRoom.uuid)
            .then(setFiles)
            .catch((err: any) => setError(err.message))
            .finally(() => setLoading(false));

        return () => { }
    }, [selectedRoom]);

    return {
        files,
        setFiles,
        error,
        isLoading,
    };
}

export default useRoomFiles;
