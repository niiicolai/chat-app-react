import { useState } from 'react';
import { RoomContext } from '../context/roomContext';
import useRooms from '../hooks/useRooms';
import Room from '../models/room';

interface RoomProviderProps {
    slot: any;
}

function RoomProvider(props: RoomProviderProps) {
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
