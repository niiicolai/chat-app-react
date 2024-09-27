import RoomFile from "../../models/room_file";
import FileIcon from "../icons/FileIcon";
import { JSX } from "react";

/**
 * @interface ChannelMessageUploadProps
 * @description The props for the ChannelMessageUpload component
 */
interface ChannelMessageUploadProps {
    channelMessage: {
        channel_message_upload: {
            uuid: string;
            channel_message_upload_type_name: string;
            channel_message: {
                uuid: string;
                body: string;
            }
            room_file: RoomFile;
        };
    };
}

/**
 * @function ChannelMessageUpload
 * @param {ChannelMessageUploadProps} props
 * @returns {JSX.Element}
 */
const ChannelMessageUpload = (props: ChannelMessageUploadProps): JSX.Element => {
    const { channelMessage } = props;
    const channel_message_upload = channelMessage?.channel_message_upload;
    const type = channel_message_upload?.channel_message_upload_type_name;
    const file = channel_message_upload?.room_file;

    switch (type) {
        case 'Image':
            return (
                <div className="w-full overflow-hidden rounded-md border border-gray-800">
                    {file && <img src={file.src} alt={file.src} className="w-full" />}
                </div>
            );
        case 'Video':
            return (
                <video controls className="w-full overflow-hidden rounded-md border border-gray-800">
                    {file && <source src={file.src} />}
                </video>
            );
        default:
            return (
                <div>
                    {file &&
                        <a href={file.src} target="_blank" rel="noreferrer"
                            className="w-48 bg-gray-500 text-xs p-3 block w-full flex gap-2 items-center hover:ring-2 hover:ring-indigo-500 rounded-md border border-gray-800">
                            <div><FileIcon fill="#FFF" width="1em" /></div>
                            <div className="whitespace-nowrap overflow-hidden overflow-ellipsis">{file.src}</div>
                        </a>
                    }
                </div>
            );
    }
}

export default ChannelMessageUpload;
