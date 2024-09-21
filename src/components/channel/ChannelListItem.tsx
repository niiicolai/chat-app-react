import Button from "../utils/Button";
import { useContext } from "react";
import { ChannelContext } from "../../context/channelContext";

const ChannelListItem = (props: any) => {
    const { setChannel } = useContext(ChannelContext);
    const { channel } = props;

    return (
        <li key={channel.uuid} className="hover:ring-2 hover:ring-indigo-800 relative rounded-md overflow-hidden w-48">
            <Button onClick={() => setChannel(channel)}
                button="button"
                type="primary"
                slot={
                    <span className="block p-3 text-left">
                        <span className="absolute left-0 right-0 top-0 bottom-0 z-10"
                            style={{
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                                backgroundImage: channel.room_file
                                    ? `url(${channel.room_file.src})`
                                    : 'none',
                            }} />
                        <span className="absolute left-0 right-0 top-0 bottom-0 bg-black/20 z-20" />
                        <span className="block relative font-bold text-lg z-30">
                            {channel.name}
                        </span>
                        <span className="block relative font-bold text-sm z-30">
                            {channel.description}
                        </span>
                    </span>
                }
            />
        </li>
    );
};

export default ChannelListItem;
