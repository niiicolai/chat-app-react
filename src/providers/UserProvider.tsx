import { useState } from 'react';
import { UserContext } from '../context/userContext';
import useUser from '../hooks/useUser';
import User from '../models/user';

interface UserProviderProps {
    slot: any;
}

function UserProvider(props: UserProviderProps) {
    const { slot } = props;
    const { user, setUser } = useUser();
    
    return (
        <UserContext.Provider value={{ user, setUser }}>
            {slot}
        </UserContext.Provider>
    );
}

export default UserProvider;
