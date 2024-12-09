import Button from "../../components/utils/Button";
import Spinner from "../../components/utils/Spinner";
import Alert from "../../components/utils/Alert";
import Link from "../../components/utils/Link";
import InputControl from "../../components/utils/InputControl";
import GhostIcon from "../../components/icons/GhostIcon";
import UserService from "../../services/userService";
import { useContext, useState, JSX, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) console.error('CONFIGURATION ERROR(apiService.ts): VITE_API_URL should be set in the .env file');

const API_PREFIX = import.meta.env.VITE_API_PREFIX;
if (!API_PREFIX) console.error('CONFIGURATION ERROR(apiService.ts): VITE_API_PREFIX should be set in the .env file');

/**
 * @function SignupView
 * @description The signup view
 * @returns {JSX.Element} JSX.Element
 */
const SignupView = (): JSX.Element => {
    const [uuid, setUuid] = useState(uuidv4());
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData(e.currentTarget);
        try {
            const user = await UserService.create(formData);
            setUuid(uuidv4());
            navigate("/");
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("An unknown error occurred");
            }
        } finally {
            setIsLoading(false);
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
                            <span>Join the Adventure!</span>
                        </div>

                        <div className="mb-3 text-left">
                            Create your account and become part of a vibrant community. Whether you’re here to chat, explore, or
                            make new friends, your journey starts with a single click. Welcome aboard!
                        </div>

                        <form onSubmit={handleSubmit} className="w-full mb-3">
                            <input type="hidden" name="uuid" value={uuid} />
                            <InputControl id="username" type="text" label="Username" name="username" />
                            <InputControl id="email" type="email" label="Email" name="email" />
                            <InputControl id="password" type="password" label="Password" name="password" />
                            <InputControl id="avatar" type="file" label="Avatar" name="file" />
                            <Button type="primary" button="submit" slot={
                                <span>{isLoading ? <Spinner isLoading={isLoading} width="2em" fill="white" /> : "Sign up"}</span>
                            } />
                        </form>

                        <Link href={API_URL + API_PREFIX + "/user/signup/google"} type="primary" slot={
                            <span>
                                Sign up with Google
                            </span>
                        } />

                        <Link href="/login" type="primary" slot={
                            <span>
                                Already have an account? Log in
                            </span>
                        } />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupView;
