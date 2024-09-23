import { useEffect, useState  } from "react";
import UserService from "../services/userService";
import User from "../models/user";

const useUser = () => {
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState("");
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        if (UserService.isAuthenticated()) {
            UserService.me()
                .then(setUser)
                .catch((err: any) => setError(err.message));
        }

        return () => {}
    }, []);

    return { user, setUser, error, isLoading };
}

export default useUser;
