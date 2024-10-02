import RoomInviteLinkService from "../services/roomInviteLinkService";
import RoomInviteLink from "../models/room_invite_link";
import { useEffect, useState, useContext, FormEvent } from "react";
import { RoomContext } from "../context/roomContext";
import { ToastContext } from "../context/toastContext";

/**
 * @interface UseRoomInviteLinks
 * @description The room invite link hook interface
 */
interface UseRoomInviteLinks {
    inviteLinks: RoomInviteLink[];
    setInviteLinks: (inviteLinks: RoomInviteLink[]) => void;
    error: string;
    isLoading: boolean;
    nextPage: () => void;
    previousPage: () => void;
    page: number;
    setPage: (page: number) => void;
    pages: number;
    setPages: (pages: number) => void;
    create: (e: FormEvent<HTMLFormElement>) => Promise<void>;
    update: (e: FormEvent<HTMLFormElement>) => Promise<void>;
    destroy: (uuid: string) => Promise<void>;
}

/**
 * @function useRoomInviteLinks
 * @description The room invite link hook
 * @returns {UseRoomInviteLinks} The room invite link hook
 */
const useRoomInviteLinks = (): UseRoomInviteLinks => {
    const { selectedRoom } = useContext(RoomContext);
    const { addToast } = useContext(ToastContext);
    const [inviteLinks, setInviteLinks] = useState<RoomInviteLink[]>([]);
    const [error, setError] = useState("");
    const [isLoading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const limit = 10;

    useEffect(() => {
        paginate(1, limit, (data: RoomInviteLink[], pages?: number) => {
            setInviteLinks(data);
            setPages(pages ?? 1);
        });

        return () => { }
    }, [selectedRoom]);

    const paginate = async (page: number, limit: number, onPaginate: (data: RoomInviteLink[], pages?: number) => void) => {
        if (!selectedRoom) return;
        setLoading(true);

        try {
            const { data, pages } = await RoomInviteLinkService.findAll(selectedRoom.uuid, page, limit);
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
        paginate(page + 1, limit, (data: RoomInviteLink[], pages?: number) => {
            setInviteLinks(data);
            setPages(pages ?? 1);
        });
    }

    const previousPage = () => {
        if (page <= 1) return;
        setPage(page - 1);
        paginate(page - 1, limit, (data: RoomInviteLink[], pages?: number) => {
            setInviteLinks(data);
            setPages(pages ?? 1);
        });
    }

    const create = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const uuid = formData.get('uuid') as string;
        const expires_at = formData.get('expires_at') as string;
        const room_uuid = formData.get('room_uuid') as string;
        const response = await RoomInviteLinkService.create({ uuid, room_uuid, expires_at });
        setInviteLinks([...inviteLinks, response]);
        addToast({ message: 'Invite link created successfully', type: 'success', duration: 5000 });
    };

    const update = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const uuid = formData.get('uuid') as string;
        const expires_at = formData.get('expires_at') as string;
        if (!uuid) return;
        const response = await RoomInviteLinkService.update(uuid, { expires_at });
        setInviteLinks(inviteLinks.map((link: RoomInviteLink) => link.uuid === response.uuid ? response : link));
        addToast({ message: 'Invite link updated successfully', type: 'success', duration: 5000 });
    };

    const destroy = async (uuid: string) => {
        await RoomInviteLinkService.destroy(uuid);
        setInviteLinks(inviteLinks.filter((link: RoomInviteLink) => link.uuid !== uuid));
        addToast({ message: 'Invite link deleted successfully', type: 'success', duration: 5000 });
    };

    return {
        inviteLinks,
        setInviteLinks,
        error,
        isLoading,
        nextPage,
        previousPage,
        page,
        setPage,
        pages,
        setPages,
        create,
        update,
        destroy
    };
}

export default useRoomInviteLinks;
