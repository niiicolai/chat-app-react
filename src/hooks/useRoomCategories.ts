import { useQuery } from '@tanstack/react-query';
import RoomService from "../services/roomService";

export const useGetRoomCategories = () => {
    return useQuery(['room_categories'], RoomService.roomCategories);
}

