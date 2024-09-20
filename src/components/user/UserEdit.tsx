import useUser from "../../hooks/useUser";
import InputControl from "../utils/InputControl";
import Button from "../utils/Button";
import Modal from "../utils/Modal";
import Spinner from "../utils/Spinner";
import Alert from "../utils/Alert";

const EditUser = (props: any) => {
    const { editUser, setEditUser } = props;
    const { error, isLoading, user, update } = useUser();

    return (
        <Modal title="Edit User" show={editUser} setShow={setEditUser} slot={
            <div>
                <p className="text-md mb-3">
                    Enter the details to edit user
                </p>

                <Alert message={error} type="error" />
                <Spinner isLoading={isLoading} fill="white" width="16" />

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
