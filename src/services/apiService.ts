import TokenService from "./tokenService";

const API_URL = import.meta.env.VITE_API_URL;
const API_PREFIX = import.meta.env.VITE_API_PREFIX;

/**
 * @interface ApiServiceBuilder
 * @description Interface for the ApiServiceBuilder
 * @property {object} methods - The methods for the builder
 * @property {object} options - The options for the builder
 */
interface ApiServiceBuilder {
    methods: BuilderMethods;
    options: BuilderOptions;
}

/**
 * @interface BuilderMethods
 * @description Interface for the builder methods
 * @property {function} endpoint - Set the endpoint for the request
 * @property {function} method - Set the method for the request
 * @property {function} header - Set a header for the request
 * @property {function} jsonBody - Set a JSON body for the request
 * @property {function} formData - Set a form data body for the request
 */
interface BuilderMethods {
    endpoint: (endpoint: string) => BuilderMethods;
    parameter: (key: string, value: string | number | undefined) => BuilderMethods;
    method: (method: string) => BuilderMethods;
    header: (key: string, value: string) => BuilderMethods;
    body: (body: object | FormData) => BuilderMethods;
    auth: () => BuilderMethods;
    execute: () => Promise<BuilderResponse | BuilderError>;
}

/**
 * @interface BuilderOptions
 * @description Interface for the builder options
 * @property {string} endpoint - The endpoint for the request
 * @property {object} parameters - The url parameters for the request
 * @property {string} method - The method for the request
 * @property {object} headers - The headers for the request
 * @property {string} body - The body for the request
 */
interface BuilderOptions {
    endpoint: string;
    parameters: { [key: string]: string | number };
    method: string;
    headers: HeadersInit;
    body: string | FormData;
    auth?: boolean;
}

/**
 * @interface BuilderResponse
 * @description Interface for the builder response
 * @property {any} data - The data from the response
 * @property {number} status - The status code from the response
 * @property {string} statusText - The status text from the response
 */
export interface BuilderResponse {
    data: any;
    status: number;
    statusText: string;
}

/**
 * @constant BuilderMethods
 * @description The methods for the request
 */
export const BuilderMethods = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    PATCH: 'PATCH',
    DELETE: 'DELETE'
}

/**
 * @error BuilderError
 * @description Error for the builder
 * @param {string} message - The error message
 * @returns {object} error
 */
export class BuilderError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'BuilderError';
    }
}

export default class ApiService {
    static builder() {
        const b = { options: { parameters: {}, headers: {} }, methods: {} } as ApiServiceBuilder;
        
        /**
         * @function endpoint
         * @description Set the endpoint for the request
         * @param {string} endpoint
         * @returns {BuilderMethods} builder
         */
        b.methods.endpoint = (endpoint: string): BuilderMethods => {
            b.options.endpoint = endpoint;
            
            return b.methods;
        }

        /**
         * @function parameter
         * @description Set a parameter for the request
         * @param {string}
         * @param {string}
         * @returns {BuilderMethods} builder
         */
        b.methods.parameter = (key: string, value: string | number | undefined): BuilderMethods => {
            if (!value) return b.methods;
            
            b.options.parameters = {
                ...b.options.parameters,
                [key]: value
            }
            
            return b.methods;
        }

        /**
         * @function method
         * @description Set the method for the request
         * @param {string}
         * @returns {BuilderMethods} builder
         */
        b.methods.method = (method: string): BuilderMethods => {
            b.options.method = method;
            return b.methods;
        }

        /**
         * @function header
         * @description Set a header for the request
         * @param {string} key
         * @param {string} value
         * @returns {BuilderMethods} builder
         */
        b.methods.header = (key: string, value: string): BuilderMethods => {
            b.options.headers = {
                ...b.options.headers,
                [key]: value
            }
            return b.methods;
        }

        /**
         * @function body
         * @description Set a JSON body for the request
         * @param {object} body
         * @returns {BuilderMethods} builder
         */
        b.methods.body = (body: object | FormData): BuilderMethods => {
            if (body instanceof FormData) {
                b.options.body = body;
            } else {
                b.options.body = JSON.stringify(body);
                b.methods.header('Content-Type', 'application/json');
            }
            return b.methods;
        }

        /**
         * @function auth
         * @description Set the authorization header for the request
         * @returns {BuilderMethods}
         */
        b.methods.auth = (): BuilderMethods => {
            b.options.auth = true;
            return b.methods;
        }

        /**
         * @function execute
         * @description Execute the request
         * @returns {Promise}
         * @throws {BuilderError}
         * @returns {Promise<BuilderResponse>} response
         */
        b.methods.execute = async (): Promise<BuilderResponse | BuilderError> => {
            if (!b.options.endpoint) throw new BuilderError('Endpoint is required');
            if (!b.options.method) throw new BuilderError('Method is required');

            const url = new URL(`${API_PREFIX}${b.options.endpoint}`, API_URL);
            Object.keys(b.options.parameters)
                .forEach(key => url.searchParams.append(key, b.options.parameters[key] as string));

            if (b.options.auth) {
                const token = TokenService.getToken();
                if (token) {
                    b.methods.header('Authorization', `Bearer ${token}`);
                } else {
                    throw new BuilderError('No token found');
                }
            }

            const response = await fetch(url.toString(), {
                method: b.options.method,
                headers: b.options.headers,
                body: b.options.body
            });

            if (response.status === 204) {
                return {
                    data: null,
                    status: response.status,
                    statusText: response.statusText
                };
            }

            const data = await response.json();

            if (!response.ok) {
                throw new BuilderError(data.error);
            }
            
            return {
                data,
                status: response.status,
                statusText: response.statusText
            };
        }

        return b.methods;
    }
}
