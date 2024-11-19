import Button from "../utils/Button";
import Modal from "../utils/Modal";
import Alert from "../utils/Alert";
import { useContext, useState, JSX, useEffect } from "react";
import { ToastContext } from "../../context/toastContext";
import UserService from "../../services/userService";
import UserLogin from "../../models/user_login";

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) console.error('CONFIGURATION ERROR(apiService.ts): VITE_API_URL should be set in the .env file');

const API_PREFIX = import.meta.env.VITE_API_PREFIX;
if (!API_PREFIX) console.error('CONFIGURATION ERROR(apiService.ts): VITE_API_PREFIX should be set in the .env file');


/**
 * @interface UserLoginsProps
 * @description The props for the UserLogins component
 */
interface UserLoginsProps {
    showUserLogins: boolean;
    setShowUserLogins: (showUserLogins: boolean) => void;
}

/**
 * @function UserLogins
 * @param {UserLoginsProps} props
 * @returns {JSX.Element}
 */
const UserLogins = (props: UserLoginsProps): JSX.Element => {
    const { showUserLogins, setShowUserLogins } = props;
    const { addToast } = useContext(ToastContext);
    const [error, setError] = useState<string | null>(null);
    const [userLogins, setUserLogins] = useState<UserLogin[]>([]);
    const [hasGoogleLogin, setHasGoogleLogin] = useState(false);

    useEffect(() => {
        UserService.logins().then((data) => {
            setUserLogins(data);
            setHasGoogleLogin(data.some((login: UserLogin) => login.user_login_type_name === "Google"));
        }).catch((err: unknown) => {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred");
            }
        });

        return () => { };
    }, []);

    const revokeAccess = (uuid: string) => {
        UserService.destroyLogin(uuid)
            .then(() => {
                setUserLogins(userLogins.filter((login: UserLogin) => login.uuid !== uuid));
                setHasGoogleLogin(userLogins.some((login: UserLogin) => login.user_login_type_name === "Google"));
                setError("");
                addToast({ message: "Login revoked", type: "success", duration: 5000 });
            })
            .catch((err: unknown) => {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("An unknown error occurred");
                }
            });
    }

    const addGoogleLogin = () => {
        location.href = API_URL + API_PREFIX + "/user/add/google";
    }

    return (
        <Modal title="User Logins" show={showUserLogins} setShow={setShowUserLogins} slot={
            <div>
                <div>
                    <Alert type="error" message={error} />

                    <div className="flex items-center justify-between gap-3 mb-3">
                        <p className="text-md">
                            Manage the logins that can be used to sign in to your account.
                        </p>

                        {!hasGoogleLogin && (
                            <div>
                                <Button display="px-3 py-1 w-full block text-sm"
                                onClick={() => addGoogleLogin()} slot={<span>Add Google Login</span>} />
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col space-y-2">
                        {userLogins.map((login: UserLogin) => (
                            <div key={login.uuid} className="flex items-center justify-between bg-gray-800 p-2 rounded">
                                <div>
                                    <p className="text-md">{login.user_login_type_name}</p>
                                    <p className="text-sm">Identifier: {login.uuid}</p>
                                </div>
                                {login.user_login_type_name !== "Password" && (
                                    <div>
                                        <Button onClick={() => revokeAccess(login.uuid)} display="px-3 py-1 w-full block text-sm" slot={
                                            <span>Revoke Access</span>
                                        } />
                                    </div>
                                )}
                                {login.user_login_type_name === "Password" && (
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Password logins cannot be removed.
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        } />
    );
};

export default UserLogins;
