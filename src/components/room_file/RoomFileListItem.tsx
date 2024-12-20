import ChannelMessageUpload from "../channel_message_upload/ChannelMessageUpload";
import TrashIcon from "../icons/TrashIcon";
import Badge from "../utils/Badge";
import Button from "../utils/Button";
import RoomFile from "../../models/room_file";
import { JSX } from "react";
import { useNavigate } from "react-router-dom";

/**
 * @interface RoomFileListItemProps
 * @description The props for the RoomFileListItem component
 */
interface RoomFileListItemProps {
    file: RoomFile;
    isAdmin: boolean;
}

/**
 * @function RoomFileListItem
 * @param {RoomFileListItemProps} props
 * @returns {JSX.Element}
 */
const RoomFileListItem = (props: RoomFileListItemProps): JSX.Element => {
    const { file, isAdmin } = props;
    const navigate = useNavigate();

    const setFileDelete = (file: RoomFile) => {
        navigate(`/room/${file.room_uuid}/file/${file.uuid}/delete`);
    }
    
    return (
        <li key={file.uuid} className="flex flex-col justify-between gap-3 border border-gray-800 rounded-md p-3">
            <div className="flex flex-col sm:gap-1 gap-2">
                <div className="flex gap-2 items-center text-indigo-500 mb-1 h-12 text-xs">
                    <Badge type="primary" title="type" slot={file.room_file_type_name} />
                    <span>{file.size_mb} MB</span>
                    <span>Created {new Date(file.created_at).toLocaleString()}</span>
                </div>
                <div>
                    {file.room_file_type_name !== 'ChannelMessageUpload' &&
                        <img src={file.src} alt={file.src} className="w-full" />
                    }
                    {file.room_file_type_name === 'ChannelMessageUpload' && file.channel_message_upload &&
                        <div className="flex flex-col items-center justify-center">
                            <ChannelMessageUpload channelMessage={{
                                channel_message_upload: {
                                    uuid: file.channel_message_upload.uuid,
                                    channel_message_upload_type_name: file.channel_message_upload.channel_message_upload_type_name,
                                    channel_message: {
                                        uuid: file.channel_message_upload.channel_message.uuid,
                                        body: file.channel_message_upload.channel_message.body
                                    },
                                    room_file: file
                                }
                            }} />
                            <div className="flex items-center gap-1 mt-2 justify-center">
                                <div className=" font-bold">Uploaded by:</div>
                                <div>{file.user?.username}</div>
                            </div>
                        </div>
                    }
                </div>
            </div>
            {isAdmin &&
                <div>
                    <Button type="error" display="h-6 w-full flex items-center justify-center" button="button" title="Delete File" onClick={() => setFileDelete(file)} slot={
                        <TrashIcon fill="white" width=".7em" />
                    } />
                </div>
            }
        </li>
    );
};

export default RoomFileListItem;
