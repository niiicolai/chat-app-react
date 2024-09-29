import { createContext } from 'react';
import Room from '../models/room';
import RoomUser from '../models/room_user';
/**
 * @constant RoomContext
 * @description The current selected room and all user rooms
 */
export const RoomContext = createContext<{
    selectedRoom: Room | null,
    selectedRoomUser: RoomUser | null,
    rooms: Room[],
    setSelectedRoom: (room: Room | null) => void,
    setSelectedRoomUser: (roomUser: RoomUser | null) => void,
    setRooms: (rooms: Room[]) => void
}>({
    selectedRoom: null,
    selectedRoomUser: null,
    rooms: [],
    setSelectedRoom: () => { },
    setSelectedRoomUser: () => { },
    setRooms: () => { }
});

