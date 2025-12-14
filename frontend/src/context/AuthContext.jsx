import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getMe, login as apiLogin } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('access_token'));

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            setUser(null);
            setIsAuthenticated(false);
            setIsLoading(false);
            return;
        }

        getMe()
            .then((res) => {
                setUser(res.data);
                setIsAuthenticated(true);
            })
            .catch(() => {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                setUser(null);
                setIsAuthenticated(false);
            })
            .finally(() => setIsLoading(false));
    }, []);

    const login = async (username, password) => {
        const res = await apiLogin(username, password);
        localStorage.setItem('access_token', res.data.access);
        localStorage.setItem('refresh_token', res.data.refresh);
        const me = await getMe();
        setUser(me.data);
        setIsAuthenticated(true);
        return me.data;
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
        setIsAuthenticated(false);
    };

    const value = useMemo(
        () => ({
            user,
            isAuthenticated,
            isLoading,
            login,
            logout,
        }),
        [user, isAuthenticated, isLoading]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
