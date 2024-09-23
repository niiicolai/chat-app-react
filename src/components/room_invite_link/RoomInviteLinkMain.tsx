import useRoomInviteLinks from "../../hooks/useRoomInviteLinks";
import RoomInviteLinkService from "../../services/roomInviteLinkService";
import RoomInviteLink from "../../models/room_invite_link";
import RoomInviteLinkList from "./RoomInviteLinkList";
import RoomInviteLinkCreate from "./RoomInviteLinkCreate";
import RoomInviteLinkUpdate from "./RoomInviteLinkUpdate";
import { useState } from "react";

interface RoomInviteLinkMainProps {
    showLinks: boolean;
    setShowLinks: (show: boolean) => void;
}

const RoomInviteLinkMain = (props: RoomInviteLinkMainProps) => {
    const { showLinks, setShowLinks } = props;
    const { inviteLinks, setInviteLinks } = useRoomInviteLinks();
    const [ showLinkCreate, setShowLinkCreate ] = useState(false);
    const [ linkEdit, setLinkEdit ] = useState<RoomInviteLink | null>(null);

    const create = async (e: any) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const uuid = formData.get('uuid') as string;
        const expires_at = formData.get('expires_at') as string;
        const room_uuid = formData.get('room_uuid') as string;
        const response = await RoomInviteLinkService.create({ uuid, room_uuid, expires_at });
        setInviteLinks((links: any) => [...links, response]);
        setShowLinkCreate(false);
    };

    const update = async (e: any) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);        
        const uuid = formData.get('uuid') as string;
        const expires_at = formData.get('expires_at') as string;
        if (!uuid) return;
        const response = await RoomInviteLinkService.update(uuid, { expires_at });
        setInviteLinks((links: any) => links.map((link: any) => link.uuid === uuid ? response : link));
        setLinkEdit(null);
    };

    const destroy = async (uuid: string) => {
        await RoomInviteLinkService.destroy(uuid);
        setInviteLinks((links: any) => links.filter((link: any) => link.uuid !== uuid));
    };

    return (
        <div>
            <RoomInviteLinkList 
                inviteLinks={inviteLinks} 
                showLinks={showLinks} 
                setShowLinkCreate={setShowLinkCreate}
                setLinkEdit={setLinkEdit} 
                setShowLinks={setShowLinks} 
                destroyLink={destroy}
            />
            <RoomInviteLinkCreate 
                showLinkCreate={showLinkCreate} 
                setShowLinkCreate={setShowLinkCreate} 
                create={create} 
            />
            <RoomInviteLinkUpdate 
                linkEdit={linkEdit} 
                setLinkEdit={setLinkEdit} 
                update={update} 
            />
        </div>
    );
};

export default RoomInviteLinkMain;
