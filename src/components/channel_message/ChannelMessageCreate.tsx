import ChannelMessageService from "../../services/channelMessageService";
import useChannelMessages from "../../hooks/useChannelMessages";
import PaperPlaneIcon from "../icons/PaperPlaneIcon";
import InputControl from "../utils/InputControl";
import Button from "../utils/Button";
import { v4 as uuidv4 } from "uuid";
import { useContext } from "react";
import { ChannelContext } from "../../context/channelContext";

const ChannelMessageCreate = (props: any) => {
    const { channel } = useContext(ChannelContext);
    const create = async (e: any) => {
        e.preventDefault();
        const form = new FormData(e.target);
        const response = await ChannelMessageService.create(form);
        console.log(response);
    };
    return (
        <div>
            {channel && (
                <div>
                    <form onSubmit={create} className="flex h-12 bg-black border-t border-gray-800 fixed sm:relative bottom-0 left-0 right-0">
                        <input type="hidden" name="uuid" value={uuidv4()} />
                        <input type="hidden" name="channel_uuid" value={channel.uuid} />
                        <input type="file" name="file" className="hidden" />
                        <input type="text" name="body" placeholder="Enter message" className="w-full focus:outline-none focus:bg-slate-800 bg-black px-3" />
                        
                        <Button type="primary" button="submit" slot={<PaperPlaneIcon fill="white" width="1em" />} display="w-24 flex items-center justify-center rounded-none" />
                    </form>
                </div>
            )}
        </div>
    );
};

export default ChannelMessageCreate;
