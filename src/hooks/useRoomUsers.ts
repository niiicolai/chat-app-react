import { useEffect, useState, useContext } from "react";
import { RoomContext } from "../context/roomContext";
import { ToastContext } from "../context/toastContext";
import RoomUserService from "../services/roomUserService";
import RoomUser from "../models/room_user";

/**
 * @interface UseRoomUsers
 * @description The room users hook interface
 */
interface UseRoomUsers {
    roomUsers: RoomUser[];
    setRoomUsers: (roomUsers: RoomUser[]) => void;
    error: string;
    isLoading: boolean;
    total: number;
    setTotal: (total: number) => void;
    page: number;
    setPage: (page: number) => void;
    pages: number;
    setPages: (pages: number) => void;
    nextPage: () => void;
    previousPage: () => void;
    update: (uuid: string, room_user_role_name: string) => Promise<void>;
    destroy: (uuid: string) => Promise<void>;
}

/**
 * @function useRoomUsers
 * @description The room users hook
 * @returns {UseRoomUsers} The room users hook
 */
const useRoomUsers = (): UseRoomUsers => {
    const { selectedRoom } = useContext(RoomContext);
    const { addToast } = useContext(ToastContext);
    const [total, setTotal] = useState(0);
    const [roomUsers, setRoomUsers] = useState<RoomUser[]>([]);
    const [error, setError] = useState("");
    const [isLoading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const limit = 10;

    useEffect(() => {
        paginate(1, limit, (data: RoomUser[], pages?: number) => {
            setRoomUsers(data);
            setPages(pages ?? 1);
        });

        return () => { }
    }, [selectedRoom]);

    const paginate = async (page: number, limit: number, onPaginate: (data: RoomUser[], pages?: number) => void) => {
        if (!selectedRoom) return;
        setLoading(true);

        try {
            const { data, total, pages } = await RoomUserService.findAll(selectedRoom.uuid, page, limit);
            onPaginate(data, pages);
            setTotal(total);
            setError("");
        } catch (err: unknown) {
            if (err instanceof Error) setError(err.message);
            else setError("An unknown error occurred");
        } finally {
            setLoading(false);
        }
    }

    const previousPage = () => {
        if (!selectedRoom) return;
        if (pages <= 1) return;
        if (page === 1) return;
        setPage(page - 1);
        paginate(page - 1, limit, (data: RoomUser[], pages?: number) => {
            setRoomUsers(data);
            setPages(pages ?? 1);
        });
    }

    const nextPage = () => {
        if (!selectedRoom) return;
        if (page === pages) return;
        setPage(page + 1);
        paginate(page + 1, limit, (data: RoomUser[], pages?: number) => {
            setRoomUsers(data);
            setPages(pages ?? 1);
        });
    }

    const update = async (uuid: string, room_user_role_name: string) => {
        if (!uuid) return;
        await RoomUserService.update(uuid, room_user_role_name);
        setRoomUsers(roomUsers.map((user: RoomUser) => {
            if (user.uuid === uuid) {
                user.room_user_role_name = room_user_role_name;
            }
            return user;
        }));
        addToast({ message: 'Room user updated', type: 'success', duration: 5000 });
    };

    const destroy = async (uuid: string) => {
        await RoomUserService.destroy(uuid);
        setRoomUsers(roomUsers.filter((user: RoomUser) => user.uuid !== uuid));
        addToast({ message: 'Room user deleted', type: 'success', duration: 5000 });
    };

    return {
        roomUsers,
        setRoomUsers,
        isLoading,
        error,
        total,
        setTotal,
        page,
        setPage,
        pages,
        setPages,
        nextPage,
        previousPage,
        update,
        destroy
    };
}

export default useRoomUsers;
