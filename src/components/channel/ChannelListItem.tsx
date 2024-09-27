import Button from "../utils/Button";
import ChannelIcon from "./ChannelIcon";
import CoverImg from "../utils/CoverImg";
import Channel from "../../models/channel";
import { ReactNode } from "react";

/**
 * @interface ChannelListItemProps
 * @description The props for the ChannelListItem component
 */
interface ChannelListItemProps {
    channel: Channel;
    setChannel: (channel: Channel | null) => void;
    isSelected: boolean;
}

/**
 * @function ChannelListItem
 * @param {ChannelListItemProps} props
 * @returns {ReactNode}
 */
const ChannelListItem = (props: ChannelListItemProps): ReactNode => {
    const { channel, setChannel, isSelected } = props;
    const selectedClass = isSelected ? 'ring-2 ring-gray-500 hover:ring-gray-500' : '';
    return (
        <li key={channel.uuid}
            className={`hover:ring-2 hover:ring-indigo-800 ${selectedClass} relative rounded-md overflow-hidden border border-gray-800`}>
            <Button onClick={() => setChannel(channel)}
                button="button"
                type="primary"
                slot={
                    <span className="block py-3 text-left">
                        <CoverImg src={channel.room_file?.src} overlay={true} />
                        
                        <span className="relative flex gap-2 items-center z-30">
                            <ChannelIcon channel_type_name={channel.channel_type_name} />
                            <span className="block font-bold text-xs z-30 overflow-hidden truncate ...">
                                {channel.name}
                            </span>
                        </span>
                    </span>
                }
            />
        </li>
    );
};

export default ChannelListItem;
