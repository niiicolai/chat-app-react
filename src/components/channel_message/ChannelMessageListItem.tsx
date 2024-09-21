import Badge from "../utils/Badge";

const ChannelMessageListItem = (props: any) => {
    const { channelMessage } = props;

    return (
        <li key={channelMessage.uuid} className="flex items-start gap-3">
            <div>
                {channelMessage.user?.avatar_src &&
                    <img src={channelMessage.user.avatar_src} alt={channelMessage.user.username} className="w-8 h-8 rounded-full" />
                }
                {!channelMessage.user?.avatar_src &&
                    <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-white">
                        {channelMessage.user?.username.charAt(0).toUpperCase()}
                    </div>
                }
            </div>
            <div>
                <div className="flex gap-2 text-indigo-500 text-xs mb-1">
                    <div>
                        {channelMessage.user?.username || "Unknown"}
                    </div>

                    <div>
                        {new Date(channelMessage.created_at).toLocaleString()}
                    </div>

                    {channelMessage.channel_message_type_name !== 'User' &&
                        <Badge type="primary" slot={channelMessage.channel_message_type_name} />
                    }
                </div>
                <div className="text-sm">
                    {channelMessage.body}
                </div>
            </div>
        </li>
    );
};

export default ChannelMessageListItem;
