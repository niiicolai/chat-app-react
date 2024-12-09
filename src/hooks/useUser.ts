import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import UserService from "../services/userService";
import UserEmailVerificationService from "../services/userEmailVerificationService";
import UserPasswordResetService from '../services/userPasswordResetService';
import User from "../models/user";

const key = ['user'];

export const useGetUser = () => {
    return useQuery(key, UserService.me);
}

export const useLoginUser = () => {
    const queryClient = useQueryClient();

    return useMutation(UserService.login, {
        onSuccess: (user: User) => queryClient.setQueryData(key, () => user)
    });
}

export const useGetLogins = () => {
    return useQuery(key, UserService.logins, {
        keepPreviousData: true,
        cacheTime: 0,
    });
}

export const useDestroyLogin = () => {
    const queryClient = useQueryClient();

    return useMutation(UserService.destroyLogin, {
        onSuccess: () => queryClient.invalidateQueries(key)
    });
}

export const useCreateUser = () => {
    const queryClient = useQueryClient();
    
    return useMutation(UserService.create, {
        onSuccess: (user: User) => queryClient.setQueryData(key, () => user)
    });
}

export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    
    return useMutation(UserService.update, {
        onSuccess: (user: User) => queryClient.setQueryData(key, () => user)
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

export const useResendEmailVerification = () => {
    return useMutation(async () => {
        await UserEmailVerificationService.resend();
    });
};

export const useCreatePasswordReset = () => {
    return useMutation(UserPasswordResetService.create);
};
