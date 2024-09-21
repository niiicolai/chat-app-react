import useChannels from "../../hooks/useChannels";
import ChannelListItem from "./ChannelListItem";
import ResMenu from "../utils/ResMenu";

const ChannelList = (props: any) => {
    const { channels, error, isLoading } = useChannels();
    return (
        <div className="p-3">
            <ResMenu type="primary" title="Channels" stickDirection="left-0" slot={
                <div className="p-3 sm:p-0">
                    <p className="font-bold text-lg text-white mb-3 sm:hidden">Channels</p>
                    <ul className="flex flex-col gap-3">
                        {channels.map((channel) => <ChannelListItem key={channel.uuid} channel={channel} />)}
                        {!channels.length && <li className="text-white">No channels found</li>}
                    </ul>
                </div>
            } />
        </div>
    );
};

export default ChannelList;
