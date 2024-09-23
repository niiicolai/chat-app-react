import ChannelMessageService from "../../services/channelMessageService";
import useChannelMessages from "../../hooks/useChannelMessages";
import PaperPlaneIcon from "../icons/PaperPlaneIcon";
import InputControl from "../utils/InputControl";
import Button from "../utils/Button";
import { v4 as uuidv4 } from "uuid";
import { useContext } from "react";
import { ChannelContext } from "../../context/channelContext";
import { useState } from "react";

interface ChannelMessageCreateProps {
    create: (e: any, file: any) => Promise<void>;
}

const ChannelMessageCreate = (props: ChannelMessageCreateProps) => {
    const { selectedChannel } = useContext(ChannelContext);
    const [message, setMessage] = useState("");
    const [uuid, setUuid] = useState(uuidv4());
    const [file, setFile] = useState('' as any);
    const { create } = props;

    const createHandler = (e: any) => {
        create(e, file).then(() => {
            setUuid(uuidv4());
            setMessage("");
            setFile('');
        });
    };

    const fileHandler = (e: any) => {
        if (!e.target.files.length) {
            setFile('');
            return;
        }
        setFile(e.target.files[0]);
    }

    return (
        <div>
            {selectedChannel && (
                <div>
                    <form onSubmit={createHandler} className="flex h-12 bg-black border-t border-gray-800 fixed sm:absolute bottom-0 left-0 right-0">
                        <input type="hidden" name="uuid" value={uuid} />
                        <input type="hidden" name="channel_uuid" value={selectedChannel.uuid} />

                        {!file && (
                            <label htmlFor="ch-msg-create-file" className="flex items-center justify-center w-12 h-12 cursor-pointer text-indigo-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </label>
                        )}
                        {file && (
                            <button className="flex items-center justify-center w-12 h-12 cursor-pointer text-red-500" onClick={() => setFile('')}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                        
                        <input type="file" name="file" id="ch-msg-create-file" className="hidden" onChange={(e) => fileHandler(e)} />
                        <input
                            type="text"
                            name="body"
                            placeholder="Enter message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full focus:outline-none focus:bg-slate-800 bg-black px-3"
                        />

                        <Button type="primary" button="submit" display="w-24 flex items-center justify-center rounded-none" slot={
                            <PaperPlaneIcon fill="white" width="1em" />
                        } />
                    </form>
                </div>
            )}
        </div>
    );
};

export default ChannelMessageCreate;
