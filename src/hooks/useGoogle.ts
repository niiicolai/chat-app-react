import { useMutation } from '@tanstack/react-query';
import GoogleService from '../services/googleService';

export const useAddToExistingUserConfirm = () => {
    return useMutation(({ third_party_id, type }: { third_party_id: string; type: string }) => 
        GoogleService.addToExistingUserConfirm(third_party_id, type)
    );
}
