import Button from "../../components/utils/Button";
import Spinner from "../../components/utils/Spinner";
import Alert from "../../components/utils/Alert";
import Link from "../../components/utils/Link";
import InputControl from "../../components/utils/InputControl";
import GhostIcon from "../../components/icons/GhostIcon";
import { useNavigate } from 'react-router-dom';
import { useContext, JSX, FormEvent } from "react";
import { ToastContext } from "../../context/toastContext";
import { useLoginUser } from "../../hooks/useUser";

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) console.error('CONFIGURATION ERROR(apiService.ts): VITE_API_URL should be set in the .env file');

const API_PREFIX = import.meta.env.VITE_API_PREFIX;
if (!API_PREFIX) console.error('CONFIGURATION ERROR(apiService.ts): VITE_API_PREFIX should be set in the .env file');


/**
 * @function LoginView
 * @description The login view
 * @returns {JSX.Element} JSX.Element
 */
const LoginView = (): JSX.Element => {
    const navigate = useNavigate();
    const { addToast } = useContext(ToastContext);
    const { mutateAsync, isLoading, error } = useLoginUser();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        if (formData.get("email") === "") {
            addToast({ message: "Email is required", type: "error", duration: 5000 });
            return;
        }

        if (formData.get("password") === "") {
            addToast({ message: "Password is required", type: "error", duration: 5000 });
            return;
        }

        try {
            await mutateAsync(formData);
            navigate("/");
            addToast({ message: "User logged in successfully", type: "success", duration: 5000 });
        } catch {
            addToast({ message: "Error logging in user", type: "error", duration: 5000 });
        }
    }

    return (
        <div className="App w-full h-screen bg-black">
            <div className="text-white h-full flex items-center justify-center">
                <div className="max-w-xl">

                    <div className="text-md overflow-hidden w-96 flex flex-col items-center justify-center gap-1 p-3 text-white">
                        <Alert type="error" message={error} testId="alert-message" />

                        <div className="flex items-center justify-center gap-6 w-full mb-3 text-3xl font-bold">
                            <GhostIcon fill="white" width="22" />
                            <span>Welcome back!</span>
                        </div>

                        <div className="mb-3 text-left">
                            Log in to continue your journey, connect with friends, and dive back into the conversation. Your adventure
                            awaits—let&lsquo;s pick up right where you left off!
                        </div>

                        <form onSubmit={handleSubmit} className="w-full mb-3">
                            <InputControl id="email" type="email" label="Email" name="email" />
                            <InputControl id="password" type="password" label="Password" name="password" />
                            <Button type="primary" button="submit" slot={
                                <span>{isLoading ? <Spinner isLoading={isLoading} width="2em" fill="white" /> : "Login"}</span>
                            } />
                        </form>

                        <Link href={API_URL + API_PREFIX + "/user/login/google"} type="primary" slot={
                            <span>
                                Sign in with Google
                            </span>
                        } />

                        <Link href="/signup" type="primary" slot={
                            <span>
                                Don&lsquo;t have an account? Sign up
                            </span>
                        } />

                        <Link href="/forgot-password" type="primary" slot={
                            <span>
                                Forgot your password? Reset it
                            </span>
                        } />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginView;
