import useRoomInviteLinks from "../../hooks/useRoomInviteLinks";
import Modal from "../utils/Modal";
import { useState } from "react";

const RoomInviteLinkList = (props: any) => {
    const { showLinks, setShowLinks } = props;
    const { inviteLinks, error, isLoading } = useRoomInviteLinks();
    const [ showLinkCreate, setShowLinkCreate ] = useState(false);
    const [ showLinkUpdate, setShowLinkUpdate ] = useState(false);
    return (
        <Modal title="Room Invite Links" show={showLinks} setShow={setShowLinks} slot={
            <div>
                <ul className="flex flex-col gap-3 mb-3">
                    {inviteLinks.map((link) => (
                        <li key={link.uuid} className="flex flex-col gap-1">
                            <span className="text-white">{link.uuid}</span>
                            <span className="text-white">{link.expires_at}</span>
                        </li>
                    ))}
                    {!inviteLinks.length && <li className="text-white">No invite links found</li>}
                </ul>
            </div>
        } />
    );
};

export default RoomInviteLinkList;
