import RoomInviteLinkListItem from "./RoomInviteLinkListItem";
import RoomInviteLink from "../../models/room_invite_link";
import Button from "../utils/Button";
import Modal from "../utils/Modal";
import Paginator from "../utils/Paginator";
import { JSX, useContext } from "react";
import { RoomContext } from "../../context/roomContext";

/**
 * @interface RoomInviteLinkListProps
 * @description The props for the RoomInviteLinkList component
 */
interface RoomInviteLinkListProps {
    error: string;
    isLoading: boolean;
    inviteLinks: RoomInviteLink[];
    setLinkEdit: (link: RoomInviteLink | null) => void;
    setLinkDelete: (link: RoomInviteLink | null) => void;
    showLinks: boolean;
    setShowLinks: (show: boolean) => void;
    setShowLinkCreate: (show: boolean) => void;
    nextPage: () => void;
    previousPage: () => void;
    page: number;
    pages: number;
}

/**
 * @function RoomInviteLinkList
 * @param {RoomInviteLinkListProps} props
 * @returns {JSX.Element}
 */
const RoomInviteLinkList = (props: RoomInviteLinkListProps): JSX.Element => {
    const { selectedRoomUser } = useContext(RoomContext);
    const isAdmin = selectedRoomUser?.room_user_role_name === 'Admin';
    const { 
        inviteLinks, setLinkEdit, showLinks, 
        setShowLinks, setLinkDelete, setShowLinkCreate,
        error, isLoading
    } = props;
    
    return (
        <Modal title="Room Invite Links" show={showLinks} setShow={setShowLinks} slot={
            <div>
                {isAdmin && 
                    <div className="mb-3">
                        <Button 
                            type="primary" 
                            button="button" 
                            title="Create Invite Link"
                            onClick={() => setShowLinkCreate(true)} 
                            slot="Create Invite Link"
                            testId="room-invite-link-create-button" 
                        />
                    </div>
                }

                <Paginator nextPage={props.nextPage} previousPage={props.previousPage} isLoading={isLoading} error={error} page={props.page} pages={props.pages} slot={
                    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 mb-3">
                        {inviteLinks.map((link) => (
                            <RoomInviteLinkListItem 
                                link={link} 
                                key={link.uuid} 
                                setLinkEdit={setLinkEdit} 
                                setLinkDelete={setLinkDelete} 
                                isAdmin={isAdmin}
                            />
                        ))}
                        {!inviteLinks.length && <li className="text-white" data-testid="room-invite-link-list-empty">No invite links found</li>}
                    </ul>
                } />
            </div>
        } />
    );
};

export default RoomInviteLinkList;
