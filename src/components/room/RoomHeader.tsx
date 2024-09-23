import Progress from "../utils/Progress";
import Badge from "../utils/Badge";
import RoomOptions from "./RoomOptions";
import { useContext } from "react";
import { RoomContext } from "../../context/roomContext";

const RoomHeader = () => {
    const { selectedRoom } = useContext(RoomContext);

    return (
        <div className="w-full text-white">
            {selectedRoom && (
                <div className="p-3 bg-gray-800" style={{
                    backgroundImage: selectedRoom.avatar.room_file ? `url(${selectedRoom.avatar.room_file.src})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}>
                    <h1 className="text-lg font-bold mb-3">
                        {selectedRoom.name}
                    </h1>

                    <div className="flex gap-3 text-xs mb-2 w-full justify-between">
                        <div className="flex gap-2 justify-start">
                            <Badge type="primary" title="Room Category" slot={selectedRoom.room_category_name} />

                            <div className="w-24 sm:w-44">
                                <Progress type="primary" value={selectedRoom.bytes_used} max={selectedRoom.fileSettings.totalFilesBytesAllowed}
                                    slot={
                                        <span className="flex items-center gap-1 justify-center text-xs overflow-hidden truncate ...">
                                            <span className="hidden sm:inline-block">File Usage:</span>
                                            <span>{selectedRoom.mb_used} / {selectedRoom.fileSettings.totalFilesMb} MB</span>
                                        </span>
                                    }
                                />
                            </div>
                        </div>

                        <RoomOptions />
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoomHeader;
