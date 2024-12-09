import RoomInviteLink from "../../models/room_invite_link";
import Button from "../utils/Button";
import PenIcon from "../icons/PenIcon";
import TrashIcon from "../icons/TrashIcon";
import CopyIcon from "../icons/CopyIcon";
import { ToastContext } from "../../context/toastContext";
import { useContext, JSX } from "react";
import { useParams, useNavigate } from "react-router-dom";

/**
 * @constant CLIENT_URL
 * @description The client url
 * @example 'http://localhost:5173'
 */
const CLIENT_URL = import.meta.env.VITE_CLIENT_URL;
if (!CLIENT_URL) console.error('CONFIGURATION ERROR(RoomInviteLinkListItem.tsx): VITE_CLIENT_URL should be set in the .env file');

/**
 * @interface RoomInviteLinkListItemProps
 * @description The props for the RoomInviteLinkListItem component
 */
interface RoomInviteLinkListItemProps {
    link: RoomInviteLink;
    isAdmin: boolean;
}

/**
 * @function RoomInviteLinkListItem
 * @param {RoomInviteLinkListItemProps} props
 * @returns {JSX.Element}
 */
const RoomInviteLinkListItem = (props: RoomInviteLinkListItemProps): JSX.Element => {
    const { link, isAdmin } = props;
    const navigate = useNavigate();
    const { addToast } = useContext(ToastContext);
    const url = new URL(`/room/${link.uuid}/join`, CLIENT_URL).toString();
    const isExpired = link.expires_at && new Date(link.expires_at) < new Date() ? 'Yes' : 'No';
    
    const copyToClipboard = () => {
        navigator.clipboard.writeText(url);
        addToast({ message: 'Invite link copied to clipboard', type: 'success', duration: 5000 });
    };

    const setLinkEdit = (link: RoomInviteLink) => {
        navigate(`/room/${link.room_uuid}/link/${link.uuid}/edit`);
    }

    const setLinkDelete = (link: RoomInviteLink) => {
        navigate(`/room/${link.room_uuid}/link/${link.uuid}/delete`);
    }

    return (
        <li className="flex flex-col gap-1 border border-gray-800 p-3 rounded-md break-all" data-testid="room-invite-link-list-item">
            <div className="flex flex-col gap-1 border-b border-gray-800 pb-2 mb-2">
                <span className="text-indigo-500">URL:</span>
                <a href={url} className="hover:underline">{url}</a>
            </div>
            <div className="flex flex-col gap-1 border-b border-gray-800 pb-2 mb-2">
                <span className="text-indigo-500">Expires at:</span>
                <pre className="text-black whitespace-pre-wrap bg-gray-500 p-2 rounded-md">{link.expires_at || 'Never'}</pre>
            </div>
            {!link.never_expires &&
                <div className="flex flex-col gap-1 border-b border-gray-800 pb-2 mb-2">
                    <span className="text-indigo-500">Is Expired:</span>
                    <pre className="text-black whitespace-pre-wrap bg-gray-500 p-2 rounded-md">{isExpired}</pre>
                </div>
            }
            <div className="bg-gray-700 p-2 rounded-md flex gap-1">
                <Button type="primary" display="h-5 w-5 flex items-center justify-center" title="Copy invite link" onClick={() => copyToClipboard()} button="button" testId="room-invite-link-copy-button" slot={
                    <CopyIcon fill="white" width=".8em" />
                } />                
                <Button type="primary" display={`${isAdmin?'':'hidden'} h-5 w-5 flex items-center justify-center`} title="Edit invite link" onClick={() => setLinkEdit(link)} button="button" testId="room-invite-link-edit-button" slot={
                    <PenIcon fill="white" width=".8em" />
                } />
                <Button type="error" display={`${isAdmin?'':'hidden'} h-5 w-5 flex items-center justify-center`} button="button" title="Delete invite link" onClick={() => setLinkDelete(link)} testId="room-invite-link-delete-button" slot={
                    <TrashIcon fill="white" width=".6em" />
                } />
            </div>
        </li>
    );
};

export default RoomInviteLinkListItem;
