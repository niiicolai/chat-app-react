import ApiService, { BuilderMethods } from "./apiService";

/**
 * @class GoogleService
 * @description Service for google authentication
 */
export default class GoogleService {

    /**
     * @function addToExistingUserConfirm
     * @description Confirm adding a google link to an existing user
     * @param {string} third_party_id - The third party id
     * @param {string} type - The type
     * @returns {Promise<void>}
     * @throws {Error} if the third_party_id is invalid
     * @throws {Error} if the type is invalid
     */
    static addToExistingUserConfirm = async (third_party_id:string, type:string): Promise<void> => {
        if (!third_party_id) throw new Error('Invalid third_party_id');
        if (!type) throw new Error('Invalid type');

        try {
            await ApiService.builder()
                .endpoint(`/user/add/google/confirm`)
                .method(BuilderMethods.POST)
                .body({ third_party_id, type })
                .auth()
                .execute();

        } catch (error: unknown) {
            throw GoogleService.handleError(error);
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
