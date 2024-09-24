import AppUnauthorized from './AppUnauthorized';
import AppLeftPanel from './AppLeftPanel';
import AppContentPanel from './AppContentPanel';
import ToastList from './toast/ToastList';
import { useContext } from "react";
import { UserContext } from "../context/userContext";

function AppMain() {
    const { user } = useContext(UserContext);

    if (!user) return (
        <AppUnauthorized />
    )
    else return (
        <div>
            <div className="w-full h-screen bg-black text-white flex flex-col sm:flex-row">
                <AppLeftPanel />
                <AppContentPanel />
            </div>

            <ToastList />
        </div>
    )
}

export default AppMain
