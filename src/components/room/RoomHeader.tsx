import Progress from "../utils/Progress";
import Badge from "../utils/Badge";
import RoomOptions from "./RoomOptions";
import { useContext } from "react";
import { RoomContext } from "../../context/roomContext";

const RoomHeader = () => {
    const { room } = useContext(RoomContext);

    return (
        <div className="w-full text-white">
            {room && (
                <div className="p-3 bg-gray-800" style={{
                    backgroundImage: room.avatar.room_file ? `url(${room.avatar.room_file.src})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}>
                    <h1 className="text-lg font-bold mb-3">
                        {room.name}
                    </h1>

                    <div className="flex gap-3 text-xs mb-2 w-full justify-between">
                        <div className="flex gap-2 justify-start">
                            <Badge type="primary" title="Room Category" slot={room.room_category_name} />

                            <div className="w-24 sm:w-44">
                                <Progress type="primary" value={room.bytes_used} max={room.fileSettings.totalFilesBytesAllowed}
                                    slot={
                                        <span className="flex items-center gap-1 justify-center text-xs overflow-hidden truncate ...">
                                            <span className="hidden sm:inline-block">File Usage:</span>
                                            <span>{room.mb_used} / {room.fileSettings.totalFilesMb} MB</span>
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
