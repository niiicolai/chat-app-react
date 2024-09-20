import { useEffect, useState } from "react";
import Room from "../models/room";
import RoomService from "../services/roomService";
import UserService from "../services/userService";

const useRooms = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [error, setError] = useState("");
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        if (UserService.isAuthenticated()) {
            setLoading(true);
            RoomService.findAll()
                .then(setRooms)
                .catch((err: any) => setError(err.message))
                .finally(() => setLoading(false));
        }

        return () => { }
    }, []);

    const create = async (event: any) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        try {
            setLoading(true);
            const room = await RoomService.create(formData);
            setRooms([...rooms, room]);
            setLoading(false);
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    }

    const update = async (event: any) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const uuid = formData.get("uuid") as string;
        formData.delete("uuid");
        try {
            setLoading(true);
            const room = await RoomService.update(uuid, formData);
            setRooms(rooms.map((r) => r.uuid === room.uuid ? room : r));
            setLoading(false);
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    }

    const destroy = async (uuid: string | undefined) => {
        if (!uuid) return;
        try {
            setLoading(true);
            await RoomService.destroy(uuid);
            setRooms(rooms.filter((r) => r.uuid !== uuid));
            setLoading(false);
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    }

    const updateSettings = async (uuid: string | undefined, settings: any) => {
        if (!uuid) return;
        try {
            setLoading(true);
            const room = await RoomService.updateSettings(uuid, settings);
            setRooms(rooms.map((r) => r.uuid === room.uuid ? room : r));
            setLoading(false);
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    }

    return {
        rooms,
        setRooms,
        error,
        isLoading,
        create,
        update,
        destroy,
        updateSettings,
    };
}

export default useRooms;
