import Button from "../components/utils/Button";
import Spinner from "../components/utils/Spinner";
import Alert from "../components/utils/Alert";
import Link from "../components/utils/Link";
import InputControl from "../components/utils/InputControl";
import GhostIcon from "../components/icons/GhostIcon";
import { useState, JSX, FormEvent } from "react";
import UserPasswordResetService from "../services/userPasswordResetService";

/**
 * @function ForgotPasswordView
 * @description The forgot password view
 * @returns {JSX.Element} JSX.Element
 */
const ForgotPasswordView = (): JSX.Element => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData(e.currentTarget);
        if (!formData.get('email')) {
            setError("Email is required");
            setIsLoading(false);
            return;
        }
        try {
            await UserPasswordResetService.create(formData);
            setIsSubmitted(true);
            setError(null);
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
                            <span>Forgot password</span>
                        </div>

                        <div className="mb-3 text-left">
                            Enter your email address to receive a password reset link.
                        </div>

                        {!isSubmitted &&
                            <form onSubmit={handleSubmit} className="w-full mb-3">
                                <InputControl id="email" type="email" label="Email" name="email" />
                                <Button type="primary" button="submit" slot={
                                    <span>{isLoading ? <Spinner isLoading={isLoading} width="2em" fill="white" /> : "Reset password"}</span>
                                } />
                            </form>
                        }

                        {isSubmitted &&
                            <div className="text-md mb-3">
                                If the email address exists in our system, you will receive a password reset link shortly.
                            </div>
                        }

                        <Link href="/login" type="primary" slot={
                            <span>
                                Remember your password? Login
                            </span>
                        } />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordView;