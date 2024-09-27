import { useContext, useState, JSX } from "react";
import { ChannelContext } from "../../context/channelContext";
import TrashIcon from "../icons/TrashIcon";
import PenIcon from "../icons/PenIcon";
import Button from "../utils/Button";
import Channel from "../../models/channel";
import ChannelService from "../../services/channelService";

/**
 * @interface ChannelHeaderProps
 * @description The props for the ChannelHeader component
 */
interface ChannelHeaderProps {
    setEditChannel: (channel: Channel | null) => void;
}

/**
 * @function ChannelHeader
 * @param {ChannelHeaderProps} props
 * @returns {JSX.Element}
 */
const ChannelHeader = (props: ChannelHeaderProps): JSX.Element => {
    const { setEditChannel } = props;
    const { channels, setChannels, selectedChannel, setSelectedChannel } = useContext(ChannelContext);
    const [showSettings, setShowSettings] = useState(false);
    const onMouseEnter = () => setShowSettings(true);
    const onMouseLeave = () => setShowSettings(false);

    const destroy = async (uuid: string | undefined) => {
        if (!uuid) return;
        await ChannelService.destroy(uuid);
        setChannels(channels.filter((channel: Channel) => channel.uuid !== uuid));
        if (selectedChannel?.uuid === uuid) {
            setSelectedChannel(null);
        }
    };

    return (
        <div className="border-b border-gray-800 flex items-center justify-between gap-3 p-3 relative" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
            {selectedChannel && <p className="text-sm text-white">{selectedChannel.description}</p>}

            {showSettings &&
                <div className="bg-gray-800 p-1 rounded-md absolute right-3 flex gap-2" style={{ top: '50%', transform: 'translateY(-50%)' }}>
                    <Button type="primary" display="h-5 w-5 flex items-center justify-center" button="button" title="Edit Channel" onClick={() => setEditChannel(selectedChannel)} slot={
                        <PenIcon fill="white" width=".6em" />
                    } />
                    <Button type="error" display="h-5 w-5 flex items-center justify-center" button="button" title="Delete Channel" onClick={() => destroy(selectedChannel?.uuid)} slot={
                        <TrashIcon fill="white" width=".6em" />
                    } />
                </div>
            }
        </div>
    );
};

export default ChannelHeader;
