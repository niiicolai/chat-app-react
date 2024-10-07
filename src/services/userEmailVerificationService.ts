import ApiService, { BuilderMethods } from "./apiService";

export default class UserEmailVerificationService {
    
    static resend = async (): Promise<void> => {
        try {
            await ApiService.builder()
                .endpoint(`/user_email_verification/me/resend`)
                .method(BuilderMethods.POST)
                .auth()
                .execute();
        } catch (error: unknown) {
            throw UserEmailVerificationService.handleError(error);
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
