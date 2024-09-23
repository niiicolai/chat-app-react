import RoomInviteLinkListItem from "./RoomInviteLinkListItem";
import RoomInviteLink from "../../models/room_invite_link";
import Button from "../utils/Button";
import Modal from "../utils/Modal";

interface RoomInviteLinkListProps {
    inviteLinks: RoomInviteLink[];
    setLinkEdit: (link: RoomInviteLink | null) => void;
    showLinks: boolean;
    setShowLinks: (show: boolean) => void;
    destroyLink: (uuid: string) => void;
    setShowLinkCreate: (show: boolean) => void;
}

const RoomInviteLinkList = (props: RoomInviteLinkListProps) => {
    const { inviteLinks, setLinkEdit, showLinks, setShowLinks, destroyLink, setShowLinkCreate } = props;
    return (
        <Modal title="Room Invite Links" show={showLinks} setShow={setShowLinks} slot={
            <div>
                <div className="mb-3">
                    <Button type="primary" button="button" title="Create Invite Link"
                    onClick={() => setShowLinkCreate(true)} slot="Create Invite Link" />
                </div>

                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 mb-3">
                    {inviteLinks.map((link) => (
                        <RoomInviteLinkListItem link={link} key={link.uuid} setLinkEdit={setLinkEdit} destroyLink={destroyLink} />
                    ))}
                    {!inviteLinks.length && <li className="text-white">No invite links found</li>}
                </ul>
            </div>
        } />
    );
};

export default RoomInviteLinkList;
