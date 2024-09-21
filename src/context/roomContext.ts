import { createContext } from 'react';
import Room from '../models/room';

export const RoomContext = createContext<{
    room: Room | null,
    setRoom: (room: Room) => void
}>({
    room: null,
    setRoom: () => { }
});

