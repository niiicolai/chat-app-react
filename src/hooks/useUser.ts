import { useEffect, useState  } from "react";
import UserService from "../services/userService";
import User from "../models/user";

/**
 * @interface UseUser
 * @description The user hook interface
 */
interface UseUser {
    user: User | null;
    setUser: (user: User | null) => void;
    error: string;
    isLoading: boolean;
}

/**
 * @function useUser
 * @description The user hook
 * @returns {UseUser} The user hook
 */
const useUser = (): UseUser => {
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState("");
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        if (UserService.isAuthenticated()) {
            setLoading(true);
            UserService.me()
                .then(setUser)
                .catch((err: unknown) => {
                    if (err instanceof Error) setError(err.message);
                    else setError("An unknown error occurred");
                })
                .finally(() => setLoading(false));
        }

        return () => {}
    }, []);

    return { 
        user, 
        setUser, 
        error, 
        isLoading 
    };
}

export default useUser;
