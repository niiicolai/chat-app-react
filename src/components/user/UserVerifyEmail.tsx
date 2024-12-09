import Alert from "../utils/Alert";
import Button from "../utils/Button";
import Spinner from "../utils/Spinner";
import { useContext, JSX } from "react";
import { ToastContext } from "../../context/toastContext";
import { useGetUser, useResendEmailVerification } from "../../hooks/useUser";

/**
 * @function UserVerifyEmail
 * @returns {JSX.Element}
 */
const UserVerifyEmail = (): JSX.Element => {
    const { addToast } = useContext(ToastContext);
    const getUser = useGetUser();
    const resendEmailVerification = useResendEmailVerification();
    const user = getUser.data;
    const error = getUser.error || resendEmailVerification.error;
    const isLoading = getUser.isLoading || resendEmailVerification.isLoading;

    const resend = async () => {
        await resendEmailVerification.mutateAsync();
        addToast({ message: 'Verification email sent', type: 'success', duration: 5000 });
    }

    return (
        <>
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
        </>
    );
};

export default UserVerifyEmail;
