import useRoomInviteLinks from "../../hooks/useRoomInviteLinks";
import RoomInviteLinkService from "../../services/roomInviteLinkService";
import RoomInviteLink from "../../models/room_invite_link";
import RoomInviteLinkList from "./RoomInviteLinkList";
import RoomInviteLinkCreate from "./RoomInviteLinkCreate";
import RoomInviteLinkUpdate from "./RoomInviteLinkUpdate";
import { useState, ReactNode, FormEvent, useContext } from "react";
import { ToastContext } from "../../context/toastContext";

/**
 * @interface RoomInviteLinkMainProps
 * @description The props for the RoomInviteLinkMain component
 */
interface RoomInviteLinkMainProps {
    showLinks: boolean;
    setShowLinks: (show: boolean) => void;
}

/**
 * @function RoomInviteLinkMain
 * @param {RoomInviteLinkMainProps} props
 * @returns {ReactNode}
 */
const RoomInviteLinkMain = (props: RoomInviteLinkMainProps): ReactNode => {
    const { showLinks, setShowLinks } = props;
    const { inviteLinks, setInviteLinks, error, isLoading } = useRoomInviteLinks();
    const [showLinkCreate, setShowLinkCreate] = useState(false);
    const [linkEdit, setLinkEdit] = useState<RoomInviteLink | null>(null);
    const { addToast } = useContext(ToastContext);

    const setShowLinksHandler = (show: boolean) => {
        setShowLinks(show);
    };

    const create = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const uuid = formData.get('uuid') as string;
        const expires_at = formData.get('expires_at') as string;
        const room_uuid = formData.get('room_uuid') as string;
        const response = await RoomInviteLinkService.create({ uuid, room_uuid, expires_at });
        setInviteLinks([...inviteLinks, response]);
        addToast({ message: 'Invite link created', type: 'success', duration: 5000 });
    };

    const update = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const uuid = formData.get('uuid') as string;
        const expires_at = formData.get('expires_at') as string;
        if (!uuid) return;
        const response = await RoomInviteLinkService.update(uuid, { expires_at });
        setInviteLinks(inviteLinks.map((link: RoomInviteLink) => link.uuid === response.uuid ? response : link));
        addToast({ message: 'Invite link updated', type: 'success', duration: 5000 });
    };

    const destroy = async (uuid: string) => {
        await RoomInviteLinkService.destroy(uuid);
        setInviteLinks(inviteLinks.filter((link: RoomInviteLink) => link.uuid !== uuid));
        addToast({ message: 'Invite link deleted', type: 'success', duration: 5000 });
    };

    if (showLinkCreate) return (
        <RoomInviteLinkCreate
            showLinkCreate={showLinkCreate}
            setShowLinkCreate={setShowLinkCreate}
            create={create}
        />
    )
    else if (linkEdit) return (
        <RoomInviteLinkUpdate
            linkEdit={linkEdit}
            setLinkEdit={setLinkEdit}
            update={update}
        />
    );

    return (
        <RoomInviteLinkList
            error={error}
            isLoading={isLoading}
            inviteLinks={inviteLinks}
            showLinks={showLinks}
            setShowLinkCreate={setShowLinkCreate}
            setLinkEdit={setLinkEdit}
            setShowLinks={setShowLinksHandler}
            destroyLink={destroy}
        />
    );
};

export default RoomInviteLinkMain;
