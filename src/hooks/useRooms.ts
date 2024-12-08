import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from "react";
import Room from "../models/room";
import RoomService from "../services/roomService";
import RoomFileService from "../services/roomFileService";

export const useUpdateRoom = (uuid: string) => {
    const queryClient = useQueryClient();

    return useMutation(async ({ uuid, formData }: { uuid: string, formData: FormData }) => {
        return await RoomService.update(uuid, formData);
    }, {
        onSuccess: (room: Room) => {
            queryClient.setQueryData(['room', uuid],
                (prevRoom: Room | undefined) => room
            )
            queryClient.setQueryData(['rooms'], (prevRooms: Room[] | undefined) => {
                if (!prevRooms) return [];
                return prevRooms.map(r => {
                    if (r.uuid === room.uuid) {
                        return room;
                    }
                    return r;
                })
            })
        }
    });
}

export const useCreateRoom = () => {
    const queryClient = useQueryClient();

    return useMutation(RoomService.create, {
        onSuccess: (room: Room) => {
            queryClient.setQueryData(['room', room.uuid], room);
            queryClient.setQueryData(['rooms'], (prevRooms: Room[] | undefined) => {
                if (!prevRooms) return [];
                return [...prevRooms, room];
            })
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
            queryClient.setQueryData(['rooms'], (prevRooms: Room[] | undefined) => {
                if (!prevRooms) return [];
                return prevRooms.map(room => {
                    if (room.uuid === uuid && room.avatar) {
                        return {
                            ...room,
                            avatar: { uuid: room.avatar.uuid, room_file: null }
                        }
                    }
                    return room;
                })
            })
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

export default useGetRooms;
