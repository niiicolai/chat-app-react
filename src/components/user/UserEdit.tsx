import InputControl from "../utils/InputControl";
import InputControlTracked from "../utils/InputControlTracked";
import Button from "../utils/Button";
import Modal from "../utils/Modal";
import Spinner from "../utils/Spinner";
import Alert from "../utils/Alert";
import { useContext, useState, JSX, FormEvent } from "react";
import { UserContext } from "../../context/userContext";
import { ToastContext } from "../../context/toastContext";
import UserService from "../../services/userService";

/**
 * @interface EditUserProps
 * @description The props for the EditUser component
 */
interface EditUserProps {
    editUser: boolean;
    setEditUser: (editUser: boolean) => void;
}

/**
 * @function EditUser
 * @param {EditUserProps} props
 * @returns {JSX.Element}
 */
const EditUser = (props: EditUserProps): JSX.Element => {
    const { editUser, setEditUser } = props;
    const { addToast } = useContext(ToastContext);
    const { user, setUser } = useContext(UserContext);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [file, setFile] = useState(user?.avatar_src as string | Blob);

    const update = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        const formData = new FormData(event.currentTarget);
        try {
            await UserService.update(formData);
            const me = await UserService.me();
            setUser(me);
            setEditUser(false);
            setFile('');
            setError('');
            addToast({ message: 'User updated', type: 'success', duration: 5000 });
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

    const destroyAvatar = async () => {
        try {
            await UserService.destroyAvatar();
            const me = await UserService.me();
            setUser(me);
            setFile('');
            setError('');
            addToast({ message: 'Avatar removed', type: 'success', duration: 5000 });
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("An unknown error occurred");
            }
        }
    }

    const fileHandler = (e: FormEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const target = e.target as HTMLInputElement;
        if (!target.files || !target.files.length) {
            setFile('');
            return;
        }
        setFile(target.files[0]);
    }

    return (
        <Modal title="Edit User" show={editUser} setShow={setEditUser} slot={
            <div>
                <Alert type="error" message={error} />

                <p className="text-md mb-3">
                    Enter the details to edit user
                </p>

                <form onSubmit={update}>
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
                        onChange={fileHandler}
                        footerSlot={
                            <div>
                                {user?.avatar_src &&
                                    <div className="p-3">
                                        <Button
                                            type="error"
                                            onClick={() => destroyAvatar()}
                                            button="button"
                                            slot="Delete Avatar"
                                        />
                                    </div>
                                }
                            </div>
                        }
                    />

                    <div className="flex flex-col gap-2">
                        <Button type="primary" button="submit" slot={
                            <span>{isLoading ? <Spinner isLoading={isLoading} width="2em" fill="white" /> : "Update"}</span>
                        } />
                    </div>
                </form>
            </div>
        } />
    );
};

export default EditUser;
