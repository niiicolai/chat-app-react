import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import RoomInviteLinkService, { RoomInviteLinkUpdateInput } from "../services/roomInviteLinkService";
import RoomInviteLink from "../models/room_invite_link";
import { useState } from "react";

export const useGetRoomInviteLink = (uuid: string) => {
    return useQuery(['roomInviteLink', uuid], ({ queryKey }) => {
        return RoomInviteLinkService.findOne(queryKey[1]);
    });
}

export const useCreateRoomInviteLink = () => {
    const queryClient = useQueryClient();

    return useMutation(RoomInviteLinkService.create, {
        onSuccess: (roomInviteLink: RoomInviteLink) => {
            queryClient.setQueryData(['roomInviteLink', roomInviteLink.uuid], roomInviteLink);
        }
    });
}

export const useUpdateRoomInviteLink = (uuid: string) => {
    const queryClient = useQueryClient();

    return useMutation(async ({ uuid, body }: { uuid: string, body: RoomInviteLinkUpdateInput }) => {
        return await RoomInviteLinkService.update(uuid, body);
    }, {
        onSuccess: (roomInviteLink: RoomInviteLink) => {
            queryClient.setQueryData(['roomInviteLink', uuid],
                (prevRoomInviteLink: RoomInviteLink | undefined) => prevRoomInviteLink
            )
        }
    });
}

export const useDestroyRoomInviteLink = (uuid: string) => {
    const queryClient = useQueryClient();

    return useMutation(RoomInviteLinkService.destroy, {
        onSuccess: () => {
            queryClient.invalidateQueries(['roomInviteLink', uuid]);
        }
    });
}

export const useGetRoomInviteLinks = (room_uuid: string) => {
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);

    const { data, error, isLoading } = useQuery(['roomInviteLinks', room_uuid, page], async () => {
        const { data, pages } = await RoomInviteLinkService.findAll(room_uuid, page, 10);
        setPages(pages ?? 1);
        return data;
    }, {
        keepPreviousData: true,
        cacheTime: 0,
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