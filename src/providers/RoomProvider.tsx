import { useState, JSX } from 'react';
import { RoomContext } from '../context/roomContext';
import useRooms from '../hooks/useRooms';
import Room from '../models/room';
import RoomUser from '../models/room_user';

/**
 * @interface RoomProviderProps
 * @description The room provider props
 */
interface RoomProviderProps {
    slot: JSX.Element;
}

/**
 * @function RoomProvider
 * @description The room provider
 * @param {RoomProviderProps} props - The props
 * @returns {JSX.Element} JSX.Element
 */
function RoomProvider(props: RoomProviderProps): JSX.Element {
    const { rooms, setRooms } = useRooms();
    const [ selectedRoom, setSelectedRoom ] = useState<Room | null>(null);
    const [ selectedRoomUser, setSelectedRoomUser ] = useState<RoomUser | null>(null);
    const { slot } = props;

    return (
        <RoomContext.Provider value={{ selectedRoom, rooms, setSelectedRoom, setRooms, selectedRoomUser, setSelectedRoomUser }}>
            {slot}
        </RoomContext.Provider>
    );
}

export default RoomProvider;
