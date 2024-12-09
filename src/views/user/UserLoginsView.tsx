import Button from "../../components/utils/Button";
import Alert from "../../components/utils/Alert";
import Spinner from "../../components/utils/Spinner";
import Restricted from "../../components/utils/Restricted";
import UserLogin from "../../models/user_login";
import { useContext, JSX } from "react";
import { ToastContext } from "../../context/toastContext";
import { useGetLogins, useDestroyLogin } from "../../hooks/useUser";
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) console.error('CONFIGURATION ERROR(UserLoginsView.ts): VITE_API_URL should be set in the .env file');

const API_PREFIX = import.meta.env.VITE_API_PREFIX;
if (!API_PREFIX) console.error('CONFIGURATION ERROR(UserLoginsView.ts): VITE_API_PREFIX should be set in the .env file');

/**
 * @function UserLogins
 * @returns {JSX.Element}
 */
const UserLoginsView = (): JSX.Element => {
    const { addToast } = useContext(ToastContext);
    const logins = useGetLogins();
    const destroyLogin = useDestroyLogin();
    const error = destroyLogin.error || logins.error;
    const { data: userLogins, isLoading } = logins;
    const navigate = useNavigate();

    const revokeAccessHandler = async (uuid: string) => {
        try {
            await destroyLogin.mutateAsync(uuid);
            addToast({ message: 'Login revoked', type: 'success', duration: 5000 });
        } catch (error) {
            addToast({ message: 'Error revoking login', type: 'error', duration: 5000 });
        }
    }

    const addGoogleLoginHandler = () => {
        location.href = API_URL + API_PREFIX + "/user/add/google";
    }

    return (
        <Restricted slot={
            <div className="bg-black min-h-screen text-white">

                <div className="flex gap-3 justify-between p-3 border-b border-gray-800">
                    <div className="text-lg font-bold">
                        User Logins
                    </div>

                    <div>
                        <Button
                            onClick={() => navigate('/')}
                            display="px-3 py-1 w-full block text-sm"
                            slot="Dashboard"
                            title="Dashboard"
                        />
                    </div>
                </div>

                <div className="p-3">
                    <Alert type="error" message={error} />

                    {isLoading && <Spinner isLoading={isLoading} width="2em" fill="white" />}
                    {!isLoading && userLogins && userLogins.length === 0 && (
                        <p className="text-md">
                            No logins found.
                        </p>
                    )}
                    {!isLoading && userLogins && userLogins.length > 0 && (
                        <>
                            <div className="flex items-center justify-between gap-3 mb-3">
                                <p className="text-md">
                                    Manage the logins that can be used to sign in to your account.
                                </p>

                                {!userLogins?.some((login: UserLogin) => login.user_login_type_name === "Google") && (
                                    <div>
                                        <Button display="px-3 py-1 w-full block text-sm"
                                            onClick={() => addGoogleLoginHandler()} slot={<span>Add Google Login</span>} />
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col space-y-2">
                                {userLogins?.map((login: UserLogin) => (
                                    <div key={login.uuid} className="flex items-center justify-between bg-gray-800 p-2 rounded">
                                        <div>
                                            <p className="text-md">{login.user_login_type_name}</p>
                                            <p className="text-sm">Identifier: {login.uuid}</p>
                                        </div>
                                        {login.user_login_type_name !== "Password" && (
                                            <div>
                                                <Button
                                                    onClick={() => revokeAccessHandler(login.uuid)}
                                                    display="px-3 py-1 w-full block text-sm"
                                                    slot="Revoke Access"
                                                    title="Revoke Access"
                                                />
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
                        </>
                    )}

                </div>
            </div>
        } />
    );
};

export default UserLoginsView;
