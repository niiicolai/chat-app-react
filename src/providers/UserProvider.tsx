import { UserContext } from '../context/userContext';
import { ReactNode } from 'react';
import useUser from '../hooks/useUser';

/**
 * @interface UserProviderProps
 * @description The user provider props
 * @param {ReactNode} slot - The slot
 */
interface UserProviderProps {
    slot: ReactNode;
}

/**
 * @function UserProvider
 * @description The user provider
 * @param {UserProviderProps} props - The props
 * @returns {ReactNode} ReactNode
 */
function UserProvider(props: UserProviderProps): ReactNode {
    const { slot } = props;
    const { user, setUser } = useUser();
    
    return (
        <UserContext.Provider value={{ user, setUser }}>
            {slot}
        </UserContext.Provider>
    );
}

export default UserProvider;
