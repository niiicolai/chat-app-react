import RoomFileService from "../services/roomFileService";
import RoomFile from "../models/room_file";
import { useEffect, useState, useContext } from "react";
import { RoomContext } from "../context/roomContext";

const useRoomFiles = () => {
    const { room } = useContext(RoomContext);
    const [ files, setFiles ] = useState<RoomFile[]>([]);
    const [ error, setError ] = useState("");
    const [ isLoading, setLoading ] = useState(false);

    useEffect(() => {
        if (!room) return;

        setLoading(true);
        
        RoomFileService
            .findAll(room.uuid)
            .then(setFiles)
            .catch((err: any) => setError(err.message))
            .finally(() => setLoading(false));

        return () => { }
    }, [room]);

    return {
        files,
        setFiles,
        error,
        isLoading,
    };
}

export default useRoomFiles;
