import Spinner from "../../components/utils/Spinner";
import Alert from "../../components/utils/Alert";
import TokenService from "../../services/tokenService";
import { useNavigate } from 'react-router-dom';
import { useState, JSX, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

/**
 * @function RedirectAuthView
 * @description The redirect auth view
 * 
 * 1. 
 * When a user manages to sign in successfully with a third-party service,
 * the server will redirect to this route with a token.
 * 
 * 2. The token is then saved by the user and used in subsequent requests.
 * 
 * @returns {JSX.Element} JSX.Element
 */
const RedirectAuthView = (): JSX.Element => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    useEffect(() => {
        setIsLoading(true);
        
        if (token) {
            TokenService.setToken(token);
            navigate("/");
        } else {
            setError("Error: No token provided");
        }

        setIsLoading(false);
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
