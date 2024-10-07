import UserEmailVerificationService from "../../services/userEmailVerificationService";
import { useContext, JSX, useState } from "react";
import { UserContext } from "../../context/userContext";
import { ToastContext } from "../../context/toastContext";
import Alert from "../utils/Alert";
import Button from "../utils/Button";
import Spinner from "../utils/Spinner";

/**
 * @function UserVerifyEmail
 * @returns {JSX.Element}
 */
const UserVerifyEmail = (): JSX.Element => {
    const { addToast } = useContext(ToastContext);
    const { user } = useContext(UserContext);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isCooldown, setIsCooldown] = useState(false);

    const resend = async () => {
        if (isCooldown) {
            addToast({ message: 'Please wait a couple of minutes before resending the email again', type: 'error', duration: 5000 });
            return;
        }

        setIsLoading(true);
        setIsCooldown(true);
        try {
            await UserEmailVerificationService.resend();
            addToast({ message: 'Verification email sent', type: 'success', duration: 5000 });
            setError('');
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("An unknown error occurred");
            }
        } finally {
            setIsLoading(false);

            const seconds = 120;
            setTimeout(() => {
                setIsCooldown(false);
            }, seconds * 1000);
        }
    }

    return (
        <div className={`${user?.email_verified ? 'hidden' : 'block'} bg-indigo-500 p-4 text-white`}>
            <Alert message={error} type="error" />
            <h1 className="text-2xl font-semibold mb-1">
                Restricted Access
            </h1>
            <p className="mb-1">
                Please verify your email address.
            </p>
            <p className="mb-2">
                If you did not receive the email, please click the button below to resend it.
            </p>
            <div className="flex flex-col gap-2">
                <Button type="success" button="submit" onClick={resend} slot={
                    <span>{isLoading ? <Spinner isLoading={isLoading} width="2em" fill="white" /> : "Resend email"}</span>
                } />
            </div>
        </div>
    );
};

export default UserVerifyEmail;
