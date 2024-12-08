
/**
 * @interface User
 * @description The User interface
 */
export default interface User {
    uuid: string;
    username: string;
    email: string;
    email_verified: boolean;
    csrf: string;
    avatar_src: string;
    created_at: string;
    updated_at: string;
}
