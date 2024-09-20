import { useEffect, useState  } from "react";
import UserService from "../services/userService";
import User from "../models/user";

const useUser = () => {
    const [user, setUser] = useState<User>();
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

    const login = async (event: any) =>  {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        try {
            setLoading(true);
            const user = await UserService.login(formData);
            setUser(user);
            setLoading(false);
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
            throw err;
        }
    }

    const create = async (event: any) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        try {
            setLoading(true);
            const user = await UserService.create(formData);
            setUser(user);
            setLoading(false);
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    }

    const update = async (event: any) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        try {
            setLoading(true);
            await UserService.update(formData);
            setLoading(false);
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    }

    const logout = async () => {
        UserService.logout();
        setUser(undefined);
    }

    return { user, setUser, error, isLoading, login, create, update, logout };
}

export default useUser;
