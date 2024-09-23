import { createContext } from 'react';
import Room from '../models/room';

export const RoomContext = createContext<{
    selectedRoom: Room | null,
    rooms: Room[],
    setSelectedRoom: (room: Room | null) => void,
    setRooms: (rooms: Room[]) => void
}>({
    selectedRoom: null,
    rooms: [],
    setSelectedRoom: () => { },
    setRooms: () => { }
});

