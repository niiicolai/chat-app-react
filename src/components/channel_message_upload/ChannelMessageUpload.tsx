import FileIcon from "../icons/FileIcon";


const ChannelMessageUpload = (props: any) => {
    const { channelMessage } = props;
    const channel_message_upload = channelMessage?.channel_message_upload;
    const type = channel_message_upload?.channel_message_upload_type_name;

    if (!channel_message_upload) return null;

    return (
        <div>
            {type === 'Image' &&
                <div className="w-full overflow-hidden rounded-md border border-gray-800">
                    <img src={channelMessage.channel_message_upload.room_file.src} alt={channelMessage.channel_message_upload.room_file.src} className="w-full" />
                </div>
            }
            {type === 'Video' &&
                <video controls className="w-full overflow-hidden rounded-md border border-gray-800">
                    <source src={channelMessage.channel_message_upload.room_file.src} />    
                </video>
            }
            {type !== 'Image' && type !== 'Video' &&
                <a href={channelMessage.channel_message_upload.room_file.src} target="_blank" rel="noreferrer" 
                    className="w-48 bg-gray-500 text-xs p-3 block w-full flex gap-2 items-center hover:ring-2 hover:ring-indigo-500 rounded-md border border-gray-800">
                    <div><FileIcon fill="#FFF" width="1em" /></div>
                    <div className="whitespace-nowrap overflow-hidden overflow-ellipsis">{channelMessage.channel_message_upload.room_file.src}</div>
                </a>
            }
        </div>
    )
}

export default ChannelMessageUpload;
