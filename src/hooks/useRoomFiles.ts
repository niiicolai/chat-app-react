import RoomFileService from "../services/roomFileService";
import RoomFile from "../models/room_file";
import { useEffect, useState, useContext } from "react";
import { RoomContext } from "../context/roomContext";
import { ToastContext } from "../context/toastContext";

/**
 * @interface UseRoomFiles
 * @description The room files hook interface
 */
interface UseRoomFiles {
    files: RoomFile[];
    setFiles: (files: RoomFile[]) => void;
    error: string;
    isLoading: boolean;
    nextPage: () => void;
    previousPage: () => void;
    pages: number;
    page: number;
    setPages: (pages: number) => void;
    setPage: (page: number) => void;
    destroy: (uuid: string) => Promise<void>;
}

/**
 * @function useRoomFiles
 * @description The room files hook
 * @returns {UseRoomFiles} The room files hook
 */
const useRoomFiles = (): UseRoomFiles => {
    const { selectedRoom } = useContext(RoomContext);
    const { addToast } = useContext(ToastContext);
    const [ files, setFiles ] = useState<RoomFile[]>([]);
    const [ error, setError ] = useState("");
    const [ isLoading, setLoading ] = useState(false);
    const [ page, setPage ] = useState(1);
    const [ pages, setPages ] = useState(1);
    const limit = 10;

    useEffect(() => {
        paginate(1, limit, (data: RoomFile[], pages?: number) => {
            setFiles(data);
            setPages(pages ?? 1);
        });

        return () => { }
    }, [selectedRoom]);


    const paginate = async (page: number, limit: number, onPaginate: (data: RoomFile[], pages?: number) => void) => {
        if (!selectedRoom) return;
        setLoading(true);

        try {
            const { data, pages } = await RoomFileService.findAll(selectedRoom.uuid, page, limit);
            onPaginate(data, pages);
            setError("");
        } catch (err: unknown) {
            if (err instanceof Error) setError(err.message);
            else setError("An unknown error occurred");
        } finally {
            setLoading(false);
        }
    }

    const nextPage = () => {
        if (page >= pages) return;
        setPage(page + 1);
        paginate(page + 1, limit, (data: RoomFile[]) => setFiles(data));
    }

    const previousPage = () => {
        if (page <= 1) return;
        setPage(page - 1);
        paginate(page - 1, limit, (data: RoomFile[]) => setFiles(data));
    }

    const destroy = async (uuid: string) => {
        try {
            await RoomFileService.destroy(uuid);
            setFiles(files.filter((file) => file.uuid !== uuid));
            addToast({ message: 'File deleted', type: 'success', duration: 5000 });
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(error.message);
            } else {
                console.error("An unknown error occurred");
            }
        }
    }

    return {
        files,
        setFiles,
        error,
        isLoading,
        nextPage,
        previousPage,
        pages,
        page,
        setPages,
        setPage,
        destroy
    };
}

export default useRoomFiles;
