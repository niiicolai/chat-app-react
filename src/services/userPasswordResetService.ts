import ApiService, { BuilderMethods } from "./apiService";

export default class UserPasswordResetService {
    
    static create = async (formData: FormData): Promise<void> => {
        if (!formData.get('email')) throw new Error('Email is required');
        const obj = { email: formData.get('email') };
        try {
            await ApiService.builder()
                .endpoint(`/user_password_reset`)
                .method(BuilderMethods.POST)
                .body(obj)
                .execute();
        } catch (error: unknown) {
            throw UserPasswordResetService.handleError(error);
        }
    }

    /**
     * @function handleError
     * @description Handle an error
     * @param {unknown} error - The error
     * @returns {Error} error
     */
    private static handleError = (error: unknown): Error => {
        if (error instanceof Error) {
            return new Error(error.message);
        } else {
            return new Error('An unknown error occurred');
        }
    }
}
