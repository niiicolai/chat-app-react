import ChannelMessageUpload from "../channel_message_upload/ChannelMessageUpload";
import TrashIcon from "../icons/TrashIcon";
import Badge from "../utils/Badge";
import Button from "../utils/Button";
import RoomFile from "../../models/room_file";
import { ReactNode } from "react";

/**
 * @interface RoomFileListItemProps
 * @description The props for the RoomFileListItem component
 */
interface RoomFileListItemProps {
    file: RoomFile;
    destroyFile: (uuid: string) => void;
}

/**
 * @function RoomFileListItem
 * @param {RoomFileListItemProps} props
 * @returns {ReactNode}
 */
const RoomFileListItem = (props: RoomFileListItemProps): ReactNode => {
    const { file, destroyFile } = props;
    return (
        <li key={file.uuid} className="flex flex-col justify-between gap-3 border border-gray-800 rounded-md p-3">
            <div className="flex flex-col sm:gap-1 gap-2">
                <div className="flex gap-2 items-center text-indigo-500 mb-1 h-12">

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
                                    channel_message_upload_type_name: file.channel_message_upload.channel_message_upload_type_name,
                                    room_file: {
                                        src: file.src
                                    }
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
            <div>
                <Button type="error" display="h-6 w-full flex items-center justify-center" button="button" title="Delete File" onClick={() => destroyFile(file.uuid)} slot={
                    <TrashIcon fill="white" width=".7em" />
                } />
            </div>
        </li>
    );
};

export default RoomFileListItem;
