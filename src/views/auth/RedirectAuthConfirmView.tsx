import Spinner from "../../components/utils/Spinner";
import Alert from "../../components/utils/Alert";
import Button from "../../components/utils/Button";
import { useNavigate } from "react-router-dom";
import { useContext, useState, JSX } from "react";
import { ToastContext } from "../../context/toastContext";
import { useSearchParams } from "react-router-dom";
import { useAddToExistingUserConfirm } from "../../hooks/useGoogle";

/**
 * @function RedirectAuthConfirmView
 * @description The redirect auth confirm view
 * 
 * When a user wants to link their account with a third-party service,
 * the server will redirect to this route with a third-party ID and type.
 * 
 * The user then has to make a final confirmation to link their account.
 * This is to ensure only authorized users can link accounts.
 * 
 * @returns {JSX.Element} JSX.Element
 */
const RedirectAuthConfirmView = (): JSX.Element => {
    const { addToast } = useContext(ToastContext);
    const { mutateAsync, isLoading, error } = useAddToExistingUserConfirm();
    const [isLinked, setIsLinked] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const confirmLink = async () => {
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
            await mutateAsync({ third_party_id, type });
            setIsLinked(true);
        } catch {
            addToast({ message: (error ? error.toString() : 'Something went wrong!'), type: "error", duration: 5000 });
        }
    }

    const toApp = () => {
        navigate("/user/logins");
    }

    return (
        <div className="App w-full h-screen bg-black">
            <div className="text-white h-full flex items-center justify-center">
                <div className="max-w-xl">
                    <Alert type="error" message={error} />

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
