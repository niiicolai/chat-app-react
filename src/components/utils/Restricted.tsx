import { JSX, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TokenService from '../../services/tokenService';

/**
 * @interface RestrictedProps
 * @description The props for the Restricted component
 */
interface RestrictedProps {
    slot: JSX.Element;
}

/**
 * @function Restricted
 * @param {RestrictedProps} props
 * @returns {JSX.Element}
 */
const Restricted = (props: RestrictedProps): JSX.Element => {
    const { slot } = props;
    const navigate = useNavigate();

    useEffect(() => {
        if (!TokenService.hasToken()) navigate('/login');
        return () => {};
    }, []);
    
    return <>{slot}</>;
};

export default Restricted;
