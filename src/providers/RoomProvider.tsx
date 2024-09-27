import { useState, ReactNode } from 'react';
import { RoomContext } from '../context/roomContext';
import useRooms from '../hooks/useRooms';
import Room from '../models/room';

/**
 * @interface RoomProviderProps
 * @description The room provider props
 * @param {ReactNode} slot - The slot
 */
interface RoomProviderProps {
    slot: ReactNode;
}

/**
 * @function RoomProvider
 * @description The room provider
 * @param {RoomProviderProps} props - The props
 * @returns {ReactNode} ReactNode
 */
function RoomProvider(props: RoomProviderProps): ReactNode {
    const { rooms, setRooms } = useRooms();
    const [ selectedRoom, setSelectedRoom ] = useState<Room | null>(null);
    const { slot } = props;

    return (
        <RoomContext.Provider value={{ selectedRoom, rooms, setSelectedRoom, setRooms }}>
            {slot}
        </RoomContext.Provider>
    );
}

export default RoomProvider;
