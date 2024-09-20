import useChannels from "../../hooks/useChannels";

const ChannelList = (props: any) => {
    const { channels, error, isLoading } = useChannels();
    return (
        <div>
            <ul className="flex flex-col gap-3 mb-3">
                {channels.map((channel) => (
                    <li key={channel.uuid} className="flex flex-col gap-1">
                        <span className="text-white">{channel.uuid}</span>
                    </li>
                ))}
                {!channels.length && <li className="text-white">No channels found</li>}
            </ul>
        </div>
    );
};

export default ChannelList;
