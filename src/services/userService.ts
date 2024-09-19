import ApiService, { BuilderResponse, BuilderMethods } from "./apiService";
import TokenService from "./tokenService";
import User from "../models/user";

export default class UserService {
    /**
     * @function findOne
     * @description Find a user by uuid
     * @param {string} uuid - The user uuid
     * @returns {Promise<User>} user
     * @throws {BuilderError}
     */
    static findOne = async (uuid: string): Promise<User> => {
        try {
            const response = await ApiService.builder()
                .endpoint(`/user/${uuid}`)
                .method(BuilderMethods.GET)
                .execute() as BuilderResponse;
            return response.data;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    /**
     * @function me
     * @description Find the current user
     * @returns {Promise<User>} user
     */
    static me = async (): Promise<User> => {
        try {
            const response = await ApiService.builder()
                .endpoint(`/user/me`)
                .method(BuilderMethods.GET)
                .auth()
                .execute() as BuilderResponse;
            return response.data;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    /**
     * @function create
     * @description Create a user
     * @param {FormData} formData - The user form data  
     * @returns {Promise<User | Error>} user
     */
    static create = async (formData: FormData): Promise<User> => {
        try {
            const response = await ApiService.builder()
                .endpoint(`/user`)
                .method(BuilderMethods.POST)
                .body(formData)
                .execute() as BuilderResponse;

            const { token, user } = response.data;
            TokenService.setToken(token);
            return user;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    /**
     * @function update
     * @description Update a user
     * @param {FormData} formData - The user form data
     * @returns {Promise<User>} user
     */
    static update = async (formData: FormData): Promise<string> => {
        try {
            const response = await ApiService.builder()
                .endpoint(`/user/me`)
                .method(BuilderMethods.PATCH)
                .body(formData)
                .auth()
                .execute() as BuilderResponse;
            return response.data.message;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    /**
     * @function destroy
     * @description Destroy a user
     * @returns {Promise<User>} user
     */
    static destroy = async (): Promise<string> => {
        try {
            const response = await ApiService.builder()
                .endpoint(`/user/me`)
                .method(BuilderMethods.DELETE)
                .auth()
                .execute() as BuilderResponse;
            return response.data.message;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    /**
     * @function login
     * @description Login a user
     * @param {FormData} formData - The user form data
     * @returns {Promise<User | Error>} user
     */
    static login = async (formData: FormData): Promise<User> => {
        try {
            const response = await ApiService.builder()
                .endpoint(`/user/login`)
                .method(BuilderMethods.POST)
                .body({
                    email: formData.get('email'),
                    password: formData.get('password')
                })
                .execute() as BuilderResponse;

            const { token, user } = response.data;
            TokenService.setToken(token);
            return user;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    /**
     * @function logout
     * @description Logout a user
     * @returns {boolean}
     */
    static logout = (): boolean => {
        TokenService.removeToken();
        return true;
    }

    /**
     * @function isAuthenicated
     * @description Check if the user is authenticated
     * @returns {boolean}
     */
    static isAuthenticated = (): boolean => {
        const token = TokenService.getToken();
        return (token && !TokenService.isTokenExpired(token)) === true;
    }
}
