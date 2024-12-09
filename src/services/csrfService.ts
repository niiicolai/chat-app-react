
const CSRF_LS_KEY = import.meta.env.VITE_CSRF_LS_KEY;
if (!CSRF_LS_KEY) console.error('CONFIGURATION ERROR(tokenService.ts): VITE_CSRF_LS_KEY should be set in the .env file');

/**
 * @class CsrfService
 */
export default class CsrfService {

    /**
     * @function setToken
     * @description Set the CSRF token
     * @param {string} token - The CSRF token
     * @returns {void}
     */
    static setToken = (token: string): void => {
        localStorage.setItem(CSRF_LS_KEY, token);
    }

    /**
     * @function getToken
     * @description Get the CSRF token
     * @returns {string | null} token
     */
    static getToken = (): string | null => {
        return localStorage.getItem(CSRF_LS_KEY);
    }

    /**
     * @function removeToken
     * @description Remove the CSRF token
     * @returns {void}
     */
    static removeToken = (): void => {
        localStorage.removeItem(CSRF_LS_KEY);
    }

    /**
     * @function hasToken
     * @description Check if the CSRF token exists
     * @returns {boolean}
     */
    static hasToken = (): boolean => {
        return !!localStorage.getItem(CSRF_LS_KEY);
    }
}
