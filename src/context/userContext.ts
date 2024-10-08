import { createContext } from 'react';
import User from '../models/user';

/**
 * @constant UserContext
 * @description The current authenticated user
 */
export const UserContext = createContext<{
    user: User | null,
    setUser: (user: User | null) => void
}>({
    user: null,
    setUser: () => { }
});

