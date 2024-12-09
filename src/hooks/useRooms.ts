import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from "react";
import Room from "../models/room";
import RoomService, { SettingsInput } from "../services/roomService";
import RoomFileService from "../services/roomFileService";

export const useCreateRoom = () => {
    const queryClient = useQueryClient();

    return useMutation(RoomService.create, {
        onSuccess: (room: Room) => {
            queryClient.setQueryData(['room', room.uuid], room);
        }
    });
}

export const useUpdateRoom = (uuid: string) => {
    const queryClient = useQueryClient();

    return useMutation(async ({ uuid, formData }: { uuid: string, formData: FormData }) => {
        return await RoomService.update(uuid, formData);
    }, {
        onSuccess: (room: Room) => {
            queryClient.setQueryData(['room', uuid], () => room)
        }
    });
}

export const useUpdateRoomSettings = (uuid: string) => {
    const queryClient = useQueryClient();

    return useMutation(async ({ settings }: { uuid: string, settings: SettingsInput }) => {
        await RoomService.updateSettings(uuid, settings);
        return RoomService.findOne(uuid);
    }, {
        onSuccess: (room: Room) => {
            queryClient.setQueryData(['room', uuid], () => room)
        }
    });
}

export const useDestroyAvatar = (uuid: string) => {
    const queryClient = useQueryClient();

    return useMutation(RoomFileService.destroy, {
        onSuccess: () => {
            queryClient.setQueryData(['room', uuid], (prevRoom: Room | undefined) => {
                if (!prevRoom) return;
                return {
                    ...prevRoom,
                    ...(prevRoom.avatar && { avatar: { uuid: prevRoom.avatar.uuid, room_file: null } })
                }
            })
        }
    });
}

export const useDestroyRoom = (uuid: string) => {
    const queryClient = useQueryClient();

    return useMutation(RoomService.destroy, {
        onSuccess: () => {
            queryClient.invalidateQueries(['room', uuid]);
        }
    });
}

export const useLeaveRoom = (uuid: string) => {
    const queryClient = useQueryClient();

    return useMutation(RoomService.leave, {
        onSuccess: () => {
            queryClient.invalidateQueries(['room', uuid]);
        }
    });
}

export const useGetRoom = (uuid: string) => {
    const [category, setCategory] = useState<string>('');

    return {
        category,
        setCategory,
        query: useQuery(['room', uuid], async () => {
            const room = await RoomService.findOne(uuid);
            setCategory(room.room_category_name);
            return room;
        })
    };
}

export const useGetRooms = () => {
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);

    const { data, error, isLoading } = useQuery(['rooms', page], async () => {
        const { data, pages } = await RoomService.findAll(page, 10);
        setPages(pages ?? 1);
        return { data, pages };
    }, {
        keepPreviousData: true,
    });

    return {
        page,
        pages,
        data,
        error,
        isLoading,
        nextPage: () => setPage(page < pages ? page + 1 : page),
        previousPage: () => setPage(page > 1 ? page - 1 : page),
    };
}

