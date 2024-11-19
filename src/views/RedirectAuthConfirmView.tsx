import Spinner from "../components/utils/Spinner";
import Button from "../components/utils/Button";
import GoogleService from "../services/googleService";
import { useNavigate } from "react-router-dom";
import { useContext, useState, JSX } from "react";
import { ToastContext } from "../context/toastContext";
import { useSearchParams } from "react-router-dom";

/**
 * @function RedirectAuthConfirmView
 * @description The redirect auth confirm view
 * @returns {JSX.Element} JSX.Element
 */
const RedirectAuthConfirmView = (): JSX.Element => {
    const { addToast } = useContext(ToastContext);
    const [isLinked, setIsLinked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const confirmLink = async () => {
        setIsLoading(true);
        const third_party_id = searchParams.get("third_party_id");
        const type = searchParams.get("type");

        if (!third_party_id) {
            addToast({ message: "No third party ID provided", type: "error", duration: 5000 });
            return;
        }

        if (!type) {
            addToast({ message: "No type provided", type: "error", duration: 5000 });
            return;
        }

        try {
            await GoogleService.addToExistingUserConfirm(third_party_id, type);
            setIsLinked(true);
        } catch (error: unknown) {
            addToast({ message: (error ? error.toString() : 'Something went wrong!'), type: "error", duration: 5000 });
        } finally {
            setIsLoading(false);
        }
    }

    const toApp = () => {
        navigate("/");
    }

    return (
        <div className="App w-full h-screen bg-black">
            <div className="text-white h-full flex items-center justify-center">
                <div className="max-w-xl">

                    <div className="text-md overflow-hidden w-96 flex flex-col items-center justify-center gap-1 p-3 text-white">
                        <h1 className="text-3xl font-bold mb-3 text-center">
                            Confirm Third Party Login: {searchParams.get("type") || "No type found!"}
                        </h1>

                        {isLinked && (
                            <div>
                                <h2 className="text-lg mb-3 text-center">
                                    Account linked successfully!
                                </h2>

                                <Button type="primary" onClick={toApp} slot="Go to App" />
                            </div>
                        )}

                        {!isLinked && (
                            <div>
                                <h2 className="text-lg mb-3 text-center">
                                    Press the button below to confirm linking your account.
                                </h2>

                                <small className="block mb-6 text-center">
                                    We do not save any tokens or passwords when linking your account.
                                    The system only saves an ID provided by the third party service
                                    which is used to verify future logins.
                                </small>

                                <Button onClick={confirmLink} title="Confirm" slot={"Confirm"} />
                            </div>
                        )}

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

export default RedirectAuthConfirmView;
