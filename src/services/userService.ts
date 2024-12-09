import ApiService, { BuilderResponse, BuilderMethods } from "./apiService";
import { validate as uuidValidate } from 'uuid';
import TokenService from "./tokenService";
import CsrfService from "./csrfService";
import User from "../models/user";
import UserLogin from "../models/user_login";

/**
 * @interface UserResponse
 * @description The user response
 * @param {User} data - The user
 */
interface UserResponse extends BuilderResponse {
    data: User;
}

/**
 * @interface UserLoginsResponse
 * @description The user logins response
 * @param {UserLogin[]} data - The user logins
 */
interface UserLoginsResponse extends BuilderResponse {
    data: UserLogin[];
}

/**
 * @interface UserCreateResponse
 * @description The user create response
 * @param {string} token - The user authentication token
 * @param {User} user - The user
 */
interface UserCreateResponse extends BuilderResponse {
    data: {
        token: string;
        user: User;
    };
}

/**
 * @class UserService
 * @description Service for the user
 */
export default class UserService {
    /**
     * @function findOne
     * @description Find a user by uuid
     * @param {string} uuid - The user uuid
     * @returns {Promise<User>} user
     * @throws {BuilderError}
     */
    static findOne = async (uuid: string): Promise<User> => {
        if (!uuidValidate(uuid)) throw new Error('Invalid uuid');

        try {
            const response = await ApiService.builder()
                .endpoint(`/user/${uuid}`)
                .method(BuilderMethods.GET)
                .execute() as UserResponse;
            return response.data;
        } catch (error: unknown) {
            throw UserService.handleError(error);
        }
    }

    /**
     * @function logins
     * @description Find the current user's logins
     * @returns {Promise<UserLogin[]>} user logins
     * @throws {BuilderError}
     */
    static logins = async (): Promise<UserLogin[]> => {
        try {
            const response = await ApiService.builder()
                .endpoint(`/user/me/logins`)
                .method(BuilderMethods.GET)
                .auth()
                .execute() as UserLoginsResponse;
            return response.data;
        } catch (error: unknown) {
            throw UserService.handleError(error);
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
                .execute() as UserResponse;

            if (response?.data?.csrf)
                CsrfService.setToken(response.data.csrf);

            return response.data;
        } catch (error: unknown) {
            throw UserService.handleError(error);
        }
    }

    /**
     * @function create
     * @description Create a user
     * @param {FormData} formData - The user form data
     * @param {string} formData.uuid - The user uuid
     * @param {string} formData.username - The user username
     * @param {string} formData.email - The user email
     * @param {string} formData.password - The user password  
     * @returns {Promise<User>} user
     * @throws {Error} if the form data's uuid is invalid
     * @throws {Error} if the form data's username is missing
     * @throws {Error} if the form data's email is missing
     * @throws {Error} if the form data's password is missing
     */
    static create = async (formData: FormData): Promise<User> => {
        if (!uuidValidate(formData.get('uuid') as string)) throw new Error('Invalid uuid');
        if (!formData.get('username')) throw new Error('Username is required');
        if (!formData.get('email')) throw new Error('Email is required');
        if (!formData.get('password')) throw new Error('Password is required');

        try {
            const response = await ApiService.builder()
                .endpoint(`/user`)
                .method(BuilderMethods.POST)
                .body(formData)
                .execute() as UserCreateResponse;

            const { token, user } = response.data;
            TokenService.setToken(token);
            return user;
        } catch (error: unknown) {
            throw UserService.handleError(error);
        }
    }

    /**
     * @function update
     * @description Update a user
     * @param {FormData} formData - The user form data
     * @param {string} formData.email - The user email (optional)
     * @param {string} formData.username - The user username (optional)
     * @param {string} formData.password - The user password (optional)
     * @returns {Promise<User>} user
     * @throws {Error} if the form data's email is not a string
     * @throws {Error} if the form data's username is not a string
     * @throws {Error} if the form data's password is not a string
     */
    static update = async (formData: FormData): Promise<User> => {
        if (formData.get('email') && typeof formData.get('email') !== 'string') throw new Error('Email must be a string');
        if (formData.get('username') && typeof formData.get('username') !== 'string') throw new Error('Username must be a string');
        if (formData.get('password') && typeof formData.get('password') !== 'string') throw new Error('Password must be a string');

        try {
            const response = await ApiService.builder()
                .endpoint(`/user/me`)
                .method(BuilderMethods.PATCH)
                .body(formData)
                .auth()
                .execute() as UserResponse;

            return response.data;
        } catch (error: unknown) {
            throw UserService.handleError(error);
        }
    }

    /**
     * @function destroy
     * @description Destroy a user
     * @returns {Promise<void>} void
     */
    static destroy = async (): Promise<void> => {
        try {
            await ApiService.builder()
                .endpoint(`/user/me`)
                .method(BuilderMethods.DELETE)
                .auth()
                .execute() as BuilderResponse;
        } catch (error: unknown) {
            throw UserService.handleError(error);
        }
    }

    /**
     * @function uploadAvatar
     * @description Upload an avatar
     * @param {File} file - The avatar file
     * @returns {Promise<User>} user
     * @throws {Error} if the file is missing
     */
    static destroyAvatar = async (): Promise<void> => {
        try {
            await ApiService.builder()
                .endpoint(`/user/me/avatar`)
                .method(BuilderMethods.DELETE)
                .auth()
                .execute() as BuilderResponse;
        } catch (error: unknown) {
            throw UserService.handleError(error);
        }
    }

    /**
     * @function destroyLogin
     * @description Destroy a user login
     * @param {string} uuid - The user login uuid
     * @returns {Promise<void>} void
     * @throws {Error} if the login uuid is missing
     */
    static destroyLogin = async (uuid: string): Promise<void> => {
        if (!uuid) throw new Error('Login uuid is required');

        try {
            await ApiService.builder()
                .endpoint(`/user/me/login/${uuid}`)
                .method(BuilderMethods.DELETE)
                .auth()
                .execute() as BuilderResponse;
        } catch (error: unknown) {
            throw UserService.handleError(error);
        }
    }

    /**
     * @function login
     * @description Login a user
     * @param {FormData} formData - The user form data
     * @returns {Promise<User>} user
     * @throws {Error} if the form data's email is missing
     * @throws {Error} if the form data's password is missing
     */
    static login = async (formData: FormData): Promise<User> => {
        if (!formData.get('email')) throw new Error('Email is required');
        if (!formData.get('password')) throw new Error('Password is required');

        try {
            const response = await ApiService.builder()
                .endpoint(`/user/login`)
                .method(BuilderMethods.POST)
                .body({
                    email: formData.get('email'),
                    password: formData.get('password')
                })
                .execute() as UserCreateResponse;

            const { token, user } = response.data;
            TokenService.setToken(token);
            return user;
        } catch (error: unknown) {
            throw UserService.handleError(error);
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
