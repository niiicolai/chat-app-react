import LayoutRoomMain from "../../components/layout/LayoutRoomMain";
import ChannelHeader from "../../components/channel/ChannelHeader";
import ChannelMessageMain from "../../components/channel_message/ChannelMessageMain";
import Spinner from "../../components/utils/Spinner";
import Alert from "../../components/utils/Alert";
import { useParams } from "react-router-dom";
import { JSX } from "react";
import { useGetChannel } from "../../hooks/useChannels";

/**
 * @function ChannelShowView
 * @description The channel show view
 * @returns {JSX.Element} JSX.Element
 */
function ChannelShowView(): JSX.Element {
    const { channel_uuid } = useParams<{ channel_uuid: string }>();
    const { data: channel, isLoading, error } = useGetChannel(channel_uuid as string);    

    return (
        <LayoutRoomMain slot={
            <div className="w-full sm:h-full sm:flex flex-col justify-between sm:border-l border-t sm:border-t-0 border-gray-800 relative">
                <Alert type="error" message={error} />

                {isLoading && (
                    <Spinner isLoading={isLoading} width="2em" fill="white" />
                )}

                {!isLoading && channel && (
                    <>
                        <ChannelHeader channel={channel} />
                        <ChannelMessageMain channel={channel} />
                    </>
                )}
            </div>
        } />
    )
}

export default ChannelShowView;
