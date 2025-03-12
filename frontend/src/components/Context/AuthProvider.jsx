import { createContext, useContext, useState, useMemo, useEffect, useRef } from 'react';
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import LoadingIndicator from '../LoadingIndicator/LoadingIndicator'; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const apiUrl = import.meta.env.VITE_API_URL; 
    const navigate = useNavigate();
    const hasNavigated = useRef(false);

    const [user, setUser] = useState();
    const [cookies, removeCookies] = useCookies();
    const [loading, setLoading] = useState(true);

    const login = async (email, password) => {
        try {
            const res = await axios.post(`${apiUrl}/auth/login`, 
                { email, password }, 
                { withCredentials: true }
            );

            if (res.data.success) {
                return { success: true, message: res.data.message };
            } else {
                return { success: false, message: res.data.message };
            }
        } catch (error) {
            return { success: false, message: error.response.data.message || "network error" };
        }
    }


    const logout = async () => {
        try {
            const res = await axios.post(`${apiUrl}/auth/logout`, {}, { withCredentials: true });
            if (res.data.success) {
                setUser(null);  
                //removeCookies("token");
                //removeCookies("name");
                return { success: true, message: res.data.message };
            } else {
                return { success: false, message: res.data.message };
            }
        } catch (error) {
            return { success: false, message: error.response.data.message || "network error" };
        }
    };

    const updateUser = (updatedFields) => {
        setUser((prevUser) => ({
            ...prevUser,
            ...updatedFields,  
        }));
    };

    const verifyToken = async () => {
        const token = cookies.token;
        if (!token) {
            setLoading(false);
            if (!hasNavigated.current) {
                navigate("/login");
                hasNavigated.current = true;
            }
            return;
        }

        try {
            const { data } = await axios.post(`${apiUrl}/auth/`, {}, { withCredentials: true });
            if (data.status) {
                setUser({ username: data.user }); 
            } else {
                if (!hasNavigated.current) {
                    //navigate("/login");
                    hasNavigated.current = true;
                }
            }

        } catch (error) {
            if (!hasNavigated.current) {
                navigate("/login");
                hasNavigated.current = true;
            }
        } finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        if (cookies.token) { 
            verifyToken();
        } else {
            setLoading(false); 
        }
    }, [cookies.token]);


    const value = useMemo(
        () => ({
            user,
            cookies,
            login,
            logout,
            verifyToken,
            loading,
            updateUser
        }), 
        [user, cookies, loading]
    );

    if (loading) {
        return (
            <div className="loading-fullscreen-container">
                <LoadingIndicator /> 
            </div>
        );
    }

    return (
        <AuthContext.Provider value={value}>
            {/*console.log("AuthProvider value:", { loading, user, cookies, login, logout })*/}
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext)
};
