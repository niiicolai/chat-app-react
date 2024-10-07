import AppUnauthorized from './AppUnauthorized';
import AppLeftPanel from './AppLeftPanel';
import AppContentPanel from './AppContentPanel';
import UserVerifyEmail from '../user/UserVerifyEmail';
import ToastList from '../toast/ToastList';
import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import { ToastContext } from "../../context/toastContext";
import { JSX, useEffect } from "react";

/**
 * @function AppMain
 * @description The main app component
 * @returns {JSX.Element} JSX.Element
 */
function AppMain(): JSX.Element {
    const { user } = useContext(UserContext);
    const { addToast } = useContext(ToastContext);

    useEffect(() => {
        if (user) {
            addToast({ message: "Welcome back!", type: "success", duration: 5000 });
        }

        return () => {}
    }, [user]);

    if (!user) return (
        <AppUnauthorized />
    )
    else return (
        <div>
            <UserVerifyEmail />
            
            <div className="w-full h-screen bg-black text-white flex flex-col sm:flex-row">
                <AppLeftPanel />
                <AppContentPanel />
            </div>

            <ToastList />
        </div>
    )
}

export default AppMain
