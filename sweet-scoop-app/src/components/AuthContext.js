import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

function AuthProvider({ children }) {
    const [status, setStatus] = useState(null);
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        }
        else {
            localStorage.removeItem("user");
        }
    }, [user]);

    const loginUser = (userData) => {
        setUser(userData);
    };

    const logoutUser = () => {
        setUser(null);
        setStatus(null);
    };

    return (
        <AuthContext.Provider value={{ status, setStatus, user, setUser, loginUser, logoutUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;