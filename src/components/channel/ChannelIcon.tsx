import { JSX } from "react";
import HashtagIcon from "../icons/HashtagIcon";
import PhoneIcon from "../icons/PhoneIcon";

/**
 * @interface ChannelIconProps
 * @description The props for the ChannelIcon component
 */
interface ChannelIconProps {
    channel_type_name: string;
}

/**
 * @function ChannelIcon
 * @param {ChannelIconProps} props
 * @returns {JSX.Element}
 */
const ChannelIcon = (props: ChannelIconProps): JSX.Element => {
    const { channel_type_name } = props;
    
    if (channel_type_name === 'Call') {
        return <PhoneIcon fill="white" width="0.8em" />;
    } else {
        return <HashtagIcon fill="white" width="0.8em" />;
    }
};

export default ChannelIcon;
