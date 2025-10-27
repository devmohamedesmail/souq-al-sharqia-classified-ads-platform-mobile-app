import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { config } from '@/constants/config';
import { Toast } from 'toastify-react-native';


export const AuthContext = createContext<any>(null);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [auth, setAuth] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
   

    // Load user from AsyncStorage on app start
    useEffect(() => {
        const loadUser = async () => {
            try {
                const userData = await AsyncStorage.getItem('user');
                if (userData) {
                    setAuth(JSON.parse(userData));
                }
            } catch (error: any) {
                console.log('Error loading user:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadUser();
    }, []);

    const handle_login = async (email: string, password: string) => {
        try {
            const response = await axios.post(`${config.URL}/login`, {
                email: email,
                password: password
            });
            const user = response.data;
            await AsyncStorage.setItem('user', JSON.stringify(user));
            setAuth(user);
            return { success: true, data: user };
        } catch (error: any) {
            console.log('Error logging in', error.response?.data || error.message);
            return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
    };

    // handle register user
    const handle_register = async (name: string, email: string, password: string) => {
        try {
            const response = await axios.post(`${config.URL}/register`, {
                name,
                email,
                password,
                
            });
            
            const user = response.data;
            await AsyncStorage.setItem('user', JSON.stringify(user));
            setAuth(user);
            return { success: true, data: user };
        } catch (error: any) {
            console.log('Error registering', error.response?.data || error.message);
            return { success: false, message: error.response?.data?.message || 'Registration failed' };
        }
    };

    // logout user
    const handle_logout = async () => {
        try {
            await AsyncStorage.removeItem('user');
            setAuth(null);
            Toast.success('Logged out successfully', 'top');
        } catch (error: any) {
            Toast.error('Logout failed', 'top');
            
        }
    };

    return (
        <AuthContext.Provider value={{
            auth,
            isLoading,
            handle_login,
            handle_register,
            handle_logout,
            // Compatibility with existing code
            user: auth?.user || auth,
            isAuthenticated: !!auth,
            login: handle_login,
            register: handle_register,
            logout: handle_logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export { AuthProvider };
export default AuthProvider;