import InputControl from "../../components/utils/InputControl";
import InputControlTracked from "../../components/utils/InputControlTracked";
import Button from "../../components/utils/Button";
import Spinner from "../../components/utils/Spinner";
import Alert from "../../components/utils/Alert";
import Restricted from "../../components/utils/Restricted";
import { useContext, JSX, FormEvent } from "react";
import { ToastContext } from "../../context/toastContext";
import { useGetUser, useUpdateUser, useDestroyAvatar } from "../../hooks/useUser";
import { useNavigate } from 'react-router-dom';

/**
 * @function UserEditView
 * @returns {JSX.Element}
 */
const UserEditView = (): JSX.Element => {
    const { addToast } = useContext(ToastContext);
    const getUser = useGetUser();
    const updateUser = useUpdateUser();
    const destroyAvatar = useDestroyAvatar();
    const navigate = useNavigate();
    const user = getUser.data;
    const isLoading = getUser.isLoading || updateUser.isLoading || destroyAvatar.isLoading;
    const error = getUser.error || updateUser.error || destroyAvatar.error;

    const updateHandler = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const formData = new FormData(event.currentTarget);
            await updateUser.mutateAsync(formData);
            navigate('/');
            addToast({ message: 'User updated successfully', type: 'success', duration: 5000 });
        } catch (error) {
            addToast({ message: 'Error updating user', type: 'error', duration: 5000 });
        }
    }

    const destroyAvatarHandler = async () => {
        try {
            await destroyAvatar.mutateAsync();
            addToast({ message: 'Avatar removed', type: 'success', duration: 5000 });
        } catch (error) {
            addToast({ message: 'Error removing avatar', type: 'error', duration: 5000 });
        }
    }

    return <Restricted slot={
        <div className="bg-black min-h-screen text-white">

            <div className="flex gap-3 justify-between p-3 border-b border-gray-800">
                <div className="text-lg font-bold">
                    Edit User
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

                <p className="text-md mb-3">
                    Enter the details to edit user
                </p>

                <form onSubmit={updateHandler} data-testid="edit-user-form">
                    <InputControl
                        id="user-edit-username"
                        type="text"
                        label="Username"
                        name="username"
                        defaultValue={user?.username}
                    />

                    <InputControl
                        id="user-edit-email"
                        type="email"
                        label="Email"
                        name="email"
                        defaultValue={user?.email}
                    />

                    <InputControl
                        id="user-edit-password"
                        type="password"
                        label="Password"
                        name="password"
                    />

                    <InputControlTracked
                        id="user-edit-file"
                        type="file"
                        label="Avatar"
                        name="file"
                        value={user?.avatar_src as string}
                        onChange={() => { }}
                        footerSlot={
                            <>
                                {user?.avatar_src &&
                                    <div className="p-3">
                                        <Button
                                            type="error"
                                            onClick={() => destroyAvatarHandler()}
                                            button="button"
                                            slot="Delete Avatar"
                                        />
                                    </div>
                                }
                            </>
                        }
                    />

                    <div className="flex flex-col gap-2">
                        {
                            isLoading
                                ? <Spinner isLoading={isLoading} width="2em" fill="white" />
                                : (<>
                                    <Button type="primary" button="submit" slot="Update" />
                                    <Button
                                        type="secondary"
                                        button="button"
                                        slot="Cancel"
                                        onClick={() => { navigate('/') }}
                                    />
                                </>)
                        }

                    </div>
                </form>
            </div>

        </div>
    } />;
};

export default UserEditView;
