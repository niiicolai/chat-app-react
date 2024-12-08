import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import UserService from "../services/userService";
import User from "../models/user";

const key = ['user'];

export const useGetUser = () => {
    return useQuery(key, UserService.me);
}

export const useGetLogins = () => {
    return useQuery(key, UserService.logins);
}

export const useDestroyLogin = () => {
    const queryClient = useQueryClient();

    return useMutation(UserService.destroyLogin, {
        onSuccess: () => queryClient.invalidateQueries(key)
    });
}

export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    
    return useMutation(UserService.update, {
        onSuccess: (user: User) => queryClient.setQueryData(key,
            (prevUser: User | undefined) => user
        )
    });
}

export const useDestroyAvatar = () => {
    const queryClient = useQueryClient();

    return useMutation(UserService.destroyAvatar, {
        onSuccess: () => queryClient.setQueryData(key, (prevUser: User | undefined) => {
            if (!prevUser) return prevUser;
            return { ...prevUser, avatar_src: '' };
        })
    });
}

export default useGetUser;
