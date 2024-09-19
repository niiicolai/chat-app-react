import useRooms from "../../hooks/useRooms";
import TrashIcon from "../icons/TrashIcon";
import Button from "../utils/Button";
import Badge from "../utils/Badge";
import PenIcon from "../icons/PenIcon";

const RoomShow = (props: any) => {
    const { room, setEditRoom } = props;
    const { destroy } = useRooms();
    return (
        <div className="p-3 border-b border-gray-800">
            <div className="text-white">
            {room && (
                <div>
                    <div className="flex gap-2 text-xs mb-1">
                        <Button type="primary"
                            display="w-8 flex items-center justify-center"
                            onClick={() => setEditRoom(room)} 
                            slot={<PenIcon fill="white" width="1em" />}
                        />
                        <Button type="error"
                            display="w-8 flex items-center justify-center"
                            onClick={() => destroy(room.uuid)}                                                
                            slot={<TrashIcon fill="white" width=".8em" />} 
                        />
                        <Badge type="primary" slot={room.room_category_name} />                            
                    </div>

                    <h1 className="text-lg font-bold">
                        {room.name}
                    </h1>
                </div>
            )}
            {!room && 
                <h1 className="text-lg font-bold text-center">
                    No room selected
                </h1>
            }
            </div>
        </div>
    );
};

export default RoomShow;
