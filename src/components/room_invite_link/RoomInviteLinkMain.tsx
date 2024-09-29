import useRoomInviteLinks from "../../hooks/useRoomInviteLinks";
import RoomInviteLink from "../../models/room_invite_link";
import RoomInviteLinkList from "./RoomInviteLinkList";
import RoomInviteLinkCreate from "./RoomInviteLinkCreate";
import RoomInviteLinkUpdate from "./RoomInviteLinkUpdate";
import { useState, JSX } from "react";

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
 * @returns {JSX.Element}
 */
const RoomInviteLinkMain = (props: RoomInviteLinkMainProps): JSX.Element => {
    const { showLinks, setShowLinks } = props;
    const { inviteLinks, error, isLoading, page, pages, nextPage, previousPage, create, update, destroy } = useRoomInviteLinks();
    const [showLinkCreate, setShowLinkCreate] = useState(false);
    const [linkEdit, setLinkEdit] = useState<RoomInviteLink | null>(null);

    const setShowLinksHandler = (show: boolean) => {
        setShowLinks(show);
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
            nextPage={nextPage}
            previousPage={previousPage}
            page={page}
            pages={pages}
        />
    );
};

export default RoomInviteLinkMain;
