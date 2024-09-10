import useUser from "../../hooks/useUser";
import Button from "../utils/Button";
import Spinner from "../utils/Spinner";
import Alert from "../utils/Alert";
import Link from "../utils/Link";
import InputControl from "../utils/InputControl";
import GhostIcon from "../icons/GhostIcon";
import { router } from "../../router/router";
import { v4 as uuidv4 } from "uuid";

const Signup = () => {
    const { error, isLoading, create } = useUser();
    const handleSubmit = async (e: any) => {
        try {
            await create(e);
            router.navigate("/");
        } catch (error: any) {
            console.error(error.message);
        }
    }

    return (
        <div className="text-white h-full flex items-center justify-center">
            <div className="max-w-xl">

                {error && <Alert message={error} type="error" />}

                <div className="text-md overflow-hidden w-96 flex flex-col items-center justify-center gap-1 p-3 text-white">
                    <div className="flex items-center justify-center gap-6 w-full mb-3 text-3xl font-bold">
                        <GhostIcon fill="white" width="22" />

                        <span>Join the Adventure!</span>
                    </div>

                    <div className="mb-3 text-left">
                        Create your account and become part of a vibrant community. Whether you’re here to chat, explore, or
                        make new friends, your journey starts with a single click. Welcome aboard!
                    </div>

                    <form onSubmit={handleSubmit} className="w-full mb-3">
                        <input type="hidden" name="uuid" value={uuidv4()} />
                        <InputControl id="username" type="text" label="Username" name="username" />
                        <InputControl id="email" type="email" label="Email" name="email" />
                        <InputControl id="password" type="password" label="Password" name="password" />
                        <InputControl id="avatar" type="file" label="Avatar" name="file" />


                        <Button type="primary" button="submit" slot={
                            <span>
                                {isLoading && <Spinner isLoading={isLoading} fill="white" width="16" />}
                                {!isLoading && <span>Sign up</span>}
                            </span>
                        } />
                    </form>

                    <Link href="/login" type="primary" slot={
                        <span>
                            Already have an account? Log in
                        </span>
                    } />
                </div>
            </div>
        </div>
    );
};

export default Signup;
