import RoomInviteLink from "../../models/room_invite_link";
import Button from "../utils/Button";
import PenIcon from "../icons/PenIcon";
import TrashIcon from "../icons/TrashIcon";
import CopyIcon from "../icons/CopyIcon";

interface RoomInviteLinkListItemProps {
    link: RoomInviteLink;
    setLinkEdit: (link: RoomInviteLink | null) => void;
    destroyLink: (uuid: string) => void;
}

const RoomInviteLinkListItem = (props: RoomInviteLinkListItemProps) => {
    const { link, setLinkEdit, destroyLink } = props;

    const CLIENT_URL = import.meta.env.VITE_CLIENT_URL;
    const url = new URL(`/room/${link.uuid}/join`, CLIENT_URL).toString();
    const isExpired = link.expires_at && new Date(link.expires_at) < new Date() ? 'Yes' : 'No';
    const copyToClipboard = () => navigator.clipboard.writeText(url);

    return (
        <li className="flex flex-col gap-1 border border-gray-800 p-3 rounded-md break-all">
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
                <Button type="primary" display="h-5 w-5 flex items-center justify-center" title="Copy invite link" onClick={() => copyToClipboard()} button="button" slot={
                    <CopyIcon fill="white" width=".8em" />
                } />
                <Button type="primary" display="h-5 w-5 flex items-center justify-center" title="Edit invite link" onClick={() => setLinkEdit(link)} button="button" slot={
                    <PenIcon fill="white" width=".8em" />
                } />
                <Button type="error" display="h-5 w-5 flex items-center justify-center" button="button" title="Delete invite link" onClick={() => destroyLink(link.uuid)} slot={
                    <TrashIcon fill="white" width=".6em" />
                } />
            </div>
        </li>
    );
};

export default RoomInviteLinkListItem;
