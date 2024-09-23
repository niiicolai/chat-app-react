import InputControl from "../utils/InputControl";
import Button from "../utils/Button";
import Modal from "../utils/Modal";
import Spinner from "../utils/Spinner";
import Alert from "../utils/Alert";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import UserService from "../../services/userService";

interface EditUserProps {
    editUser: boolean;
    setEditUser: (editUser: boolean) => void;
}

const EditUser = (props: EditUserProps) => {
    const { editUser, setEditUser } = props;
    const { user, setUser } = useContext(UserContext);

    const update = async (event: any) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        try {
            await UserService.update(formData);
            const me = await UserService.me();
            setUser(me);
            setEditUser(false);
        } catch (err: any) {
            console.error(err);
        }
    }

    return (
        <Modal title="Edit User" show={editUser} setShow={setEditUser} slot={
            <div>
                <p className="text-md mb-3">
                    Enter the details to edit user
                </p>

                <form onSubmit={update}>
                    <InputControl id="user-edit-username" type="text" label="Username" name="username" defaultValue={user?.username} />
                    <InputControl id="user-edit-email" type="email" label="Email" name="email" defaultValue={user?.email} />
                    <InputControl id="user-edit-password" type="password" label="Password" name="password" />
                    <InputControl id="user-edit-file" type="file" label="Avatar" name="file" />

                    <div className="flex flex-col gap-2">
                        <Button type="primary" button="submit" slot="Update" />
                    </div>
                </form>
            </div>
        } />
    );
};

export default EditUser;
