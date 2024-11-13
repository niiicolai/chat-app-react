import Spinner from "../components/utils/Spinner";
import Alert from "../components/utils/Alert";
import UserService from "../services/userService";
import TokenService from "../services/tokenService";
import { useNavigate } from 'react-router-dom';
import { useContext, useState, JSX, useEffect } from "react";
import { UserContext } from "../context/userContext";
import { useSearchParams } from "react-router-dom";

/**
 * @function LoginView
 * @description The login view
 * @returns {JSX.Element} JSX.Element
 */
const RedirectAuthView = (): JSX.Element => {
    const { setUser } = useContext(UserContext);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    useEffect(() => {
        setIsLoading(true);
        const token = searchParams.get("token");
        if (token) {
            TokenService.setToken(token);
            UserService.me().then(user => {
                setUser(user);
                navigate("/");
            }).catch(error => {
                setError(error.message);
            }).finally(() => {
                setIsLoading(false);
            });
        } else {
            setError("Error: No token provided");
            setIsLoading(false);
        }

        return () => {};
    }, []);

    return (
        <div className="App w-full h-screen bg-black">
            <div className="text-white h-full flex items-center justify-center">
                <div className="max-w-xl">

                    <div className="text-md overflow-hidden w-96 flex flex-col items-center justify-center gap-1 p-3 text-white">
                        <Alert type="error" message={error} testId="alert-message" />

                        {isLoading && (
                            <div>
                                <Spinner isLoading={isLoading} width="2em" fill="white" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RedirectAuthView;
