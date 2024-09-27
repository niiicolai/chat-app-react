import { UserContext } from '../context/userContext';
import { JSX } from 'react';
import useUser from '../hooks/useUser';

/**
 * @interface UserProviderProps
 * @description The user provider props
 */
interface UserProviderProps {
    slot: JSX.Element;
}

/**
 * @function UserProvider
 * @description The user provider
 * @param {UserProviderProps} props - The props
 * @returns {JSX.Element} JSX.Element
 */
function UserProvider(props: UserProviderProps): JSX.Element {
    const { slot } = props;
    const { user, setUser } = useUser();
    
    return (
        <UserContext.Provider value={{ user, setUser }}>
            {slot}
        </UserContext.Provider>
    );
}

export default UserProvider;
