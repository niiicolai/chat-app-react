import HashtagIcon from "../icons/HashtagIcon";
import PhoneIcon from "../icons/PhoneIcon";

interface ChannelIconProps {
    channel_type_name: string;
}

const ChannelIcon = (props: ChannelIconProps) => {
    const { channel_type_name } = props;
    
    if (channel_type_name === 'Call') {
        return <PhoneIcon fill="white" width="0.8em" />;
    } else {
        return <HashtagIcon fill="white" width="0.8em" />;
    }
};

export default ChannelIcon;
