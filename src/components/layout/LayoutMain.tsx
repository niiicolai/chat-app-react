import LayoutLeftPanel from './LayoutLeftPanel';
import Restricted from '../utils/Restricted';
import UserVerifyEmail from '../user/UserVerifyEmail';
import { JSX } from "react";

/**
 * @interface LayoutProps
 * @description The props for the Layout component
 */
interface LayoutProps {
    slot: JSX.Element;
}

/**
 * @function LayoutMain
 * @description The main layout component
 * @returns {JSX.Element} JSX.Element
 */
function LayoutMain(props: LayoutProps): JSX.Element {
    const { slot } = props;

    return (
        <Restricted slot={
            <>
                <UserVerifyEmail />

                <div className="w-full h-screen bg-black text-white flex flex-col sm:flex-row">
                    <LayoutLeftPanel />

                    {slot}
                </div>
            </>
        } />
    )
}

export default LayoutMain;
