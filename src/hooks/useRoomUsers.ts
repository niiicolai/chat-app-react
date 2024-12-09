import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from "react";
import RoomUserService from "../services/roomUserService";
import RoomUser from "../models/room_user";

export const useGetAuthenticatedRoomUser = (room_uuid: string) => {
    return useQuery(['room_user', room_uuid], ({ queryKey }) => {
        return RoomUserService.findAuthenticatedUser(queryKey[1]);
    });
}

export const useUpdateRoomUser = (uuid: string) => {
    const queryClient = useQueryClient();

    return useMutation(async ({ uuid, room_user_role_name }: { uuid: string, room_user_role_name: string }) => {
        return await RoomUserService.update(uuid, room_user_role_name);
    }, {
        onSuccess: () => {
            queryClient.setQueryData(['roomUser', uuid],
                (prevRoomUser: RoomUser | undefined) => prevRoomUser
            )
        }
    });
}

export const useDestroyRoomUser = (uuid: string) => {
    const queryClient = useQueryClient();

    return useMutation(RoomUserService.destroy, {
        onSuccess: () => {
            queryClient.invalidateQueries(['roomUser', uuid]);
        }
    });
}

export const useGetRoomUsers = (room_uuid: string) => {
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);

    const { data, error, isLoading, refetch } = useQuery(['roomUsers', room_uuid, page], async () => {
        const { data, pages, total } = await RoomUserService.findAll(room_uuid, page, 10);
        setPages(pages ?? 1);
        return {data, total};
    }, {
        keepPreviousData: true,
        cacheTime: 0,
    });

    return {
        refetch,
        page,
        pages,
        data,
        error,
        isLoading,
        nextPage: () => setPage(page < pages ? page + 1 : page),
        previousPage: () => setPage(page > 1 ? page - 1 : page),
    };
}
