import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import RoomFileService from "../services/roomFileService";
import { useState } from "react";

export const useGetRoomFile = (uuid: string) => {
    return useQuery(['roomfile', uuid], ({ queryKey }) => {
        return RoomFileService.findOne(queryKey[1]);
    });
}

export const useGetRoomFiles = (room_uuid: string) => {
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);

    const { data, error, isLoading } = useQuery(['roomfiles', room_uuid, page], async () => {
        const { data, pages } = await RoomFileService.findAll(room_uuid, page, 10);
        setPages(pages ?? 1);
        return data;
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

export const useDestroyRoomFile = (uuid: string) => {
    const queryClient = useQueryClient();

    return useMutation(RoomFileService.destroy, {
        onSuccess: () => {
            queryClient.invalidateQueries(['roomfile', uuid]);
        }
    });
}
