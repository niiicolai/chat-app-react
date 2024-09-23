import Button from "../utils/Button";
import Spinner from "../utils/Spinner";
import Alert from "../utils/Alert";
import Link from "../utils/Link";
import InputControl from "../utils/InputControl";
import GhostIcon from "../icons/GhostIcon";
import { useNavigate } from 'react-router-dom';
import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import UserService from "../../services/userService";

const Login = () => {
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        try {
            const user = await UserService.login(formData);
            setUser(user);
            navigate("/");
        } catch (error: any) {
            console.error(error.message);
        }
    }

    return (
        <div className="text-white h-full flex items-center justify-center">
            <div className="max-w-xl">

                <div className="text-md overflow-hidden w-96 flex flex-col items-center justify-center gap-1 p-3 text-white">
                    <div className="flex items-center justify-center gap-6 w-full mb-3 text-3xl font-bold">
                        <GhostIcon fill="white" width="22" />

                        <span>Welcome back!</span>
                    </div>

                    <div className="mb-3 text-left">
                        Log in to continue your journey, connect with friends, and dive back into the conversation. Your adventure
                        awaits—let’s pick up right where you left off!
                    </div>

                    <form onSubmit={handleSubmit} className="w-full mb-3">
                        <InputControl id="email" type="email" label="Email" name="email" />
                        <InputControl id="password" type="password" label="Password" name="password" />

                        <Button type="primary" button="submit" slot={
                            <span>
                                Login
                            </span>
                        }/>
                    </form>

                    <Link href="/signup" type="primary" slot={
                        <span>
                            Don't have an account? Sign up
                        </span>
                    }/>
                </div>
            </div>
        </div>
    );
};

export default Login;
