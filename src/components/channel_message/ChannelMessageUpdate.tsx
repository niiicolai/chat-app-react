import ChannelMessageService from "../../services/channelMessageService";
import InputControl from "../utils/InputControl";
import Button from "../utils/Button";

const ChannelMessageUpdate = (props: any) => {
    const { editMessage, setEditMessage } = props;
    const update = async (e: any) => {
        e.preventDefault();
        const form = new FormData(e.target);
        const response = await ChannelMessageService.update(editMessage.uuid, form);
        console.log(response);
    };
    return (
        <div>
            {editMessage && (
                <div>
                    <form onSubmit={update} className="flex h-12 bg-black border-t border-gray-800 fixed sm:relative bottom-0 left-0 right-0">
                        <input type="file" name="file" className="hidden" />
                        <input type="text" name="body" placeholder="Enter message" className="w-full focus:outline-none focus:bg-slate-800 bg-black px-3" />
                        
                        <Button type="primary" button="submit" slot="Update" display="w-24 flex items-center justify-center rounded-none" />
                        <Button onClick={() => setEditMessage(null)} type="secondary" button="button" slot="Cancel" display="w-24 flex items-center justify-center rounded-none" />
                    </form>
                </div>
            )}
        </div>
    );
};

export default ChannelMessageUpdate;
