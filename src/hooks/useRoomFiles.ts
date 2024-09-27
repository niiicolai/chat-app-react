import RoomFileService from "../services/roomFileService";
import RoomFile from "../models/room_file";
import { useEffect, useState, useContext } from "react";
import { RoomContext } from "../context/roomContext";

/**
 * @interface UseRoomFiles
 * @description The room files hook interface
 */
interface UseRoomFiles {
    files: RoomFile[];
    setFiles: (files: RoomFile[]) => void;
    error: string;
    isLoading: boolean;
}

/**
 * @function useRoomFiles
 * @description The room files hook
 * @returns {UseRoomFiles} The room files hook
 */
const useRoomFiles = (): UseRoomFiles => {
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
            .catch((err: unknown) => {
                if (err instanceof Error) setError(err.message);
                else setError("An unknown error occurred");
            })
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
