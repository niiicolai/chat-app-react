import RoomInviteLinkListItem from "../../components/room_invite_link/RoomInviteLinkListItem";
import Button from "../../components/utils/Button";
import Restricted from "../../components/utils/Restricted";
import Paginator from "../../components/utils/Paginator";
import { JSX } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetAuthenticatedRoomUser } from "../../hooks/useRoomUsers";
import { useGetRoomInviteLinks } from "../../hooks/useRoomInviteLinks";

/**
 * @function RoomInviteLinkListView
 * @returns {JSX.Element}
 */
const RoomInviteLinkListView = (): JSX.Element => {
    const navigate = useNavigate();
    const { room_uuid } = useParams<{ room_uuid: string }>();
    const getRoomUser = useGetAuthenticatedRoomUser(room_uuid as string);
    const getRoomInviteLinks = useGetRoomInviteLinks(room_uuid as string);
    const roomUser = getRoomUser.data;
    const { data: inviteLinks, pages, page, nextPage, previousPage } = getRoomInviteLinks;
    const isLoading = getRoomInviteLinks.isLoading || getRoomUser.isLoading;
    const error = getRoomInviteLinks.error || getRoomUser.error;
    const isAdmin = roomUser?.room_user_role_name === 'Admin';

    return (
        <Restricted slot={
            <div className="bg-black min-h-screen text-white">

                <div className="flex gap-3 justify-between p-3 border-b border-gray-800">
                    <div className="text-lg font-bold">
                        Room Invite Links
                    </div>

                    <div className="flex gap-3">
                        {isAdmin &&
                            <Button
                                type="primary"
                                button="button"
                                title="Create Link"
                                display="px-3 py-1 w-full block text-sm"
                                onClick={() => navigate(`/room/${room_uuid}/link/create`)}
                                slot="Create Link"
                                testId="room-invite-link-create-button"
                            />
                        }

                        <Button
                            onClick={() => navigate(`/room/${room_uuid}`)}
                            display="px-3 py-1 w-full block text-sm"
                            slot="Back to Room"
                            title="Back to Room"
                        />
                    </div>
                </div>

                <div className="p-3">
                    <Paginator nextPage={nextPage} previousPage={previousPage} isLoading={isLoading} error={error} page={page} pages={pages} slot={
                        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 mb-3">
                            {inviteLinks && inviteLinks.map((link) => (
                                <RoomInviteLinkListItem
                                    link={link}
                                    key={link.uuid}
                                    isAdmin={isAdmin}
                                />
                            ))}
                            {!inviteLinks || !inviteLinks.length && (
                                <li className="text-white" data-testid="room-invite-link-list-empty">No invite links found</li>
                            )}
                        </ul>
                    } />
                </div>
            </div>
        } />
    );
};

export default RoomInviteLinkListView;
