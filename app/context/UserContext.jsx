'use client'

import React, { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";
import { apiCall } from "../utils/api";
import { useRouter } from 'next/navigation'
const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter()


    const checkUser = async () => {
        const currentUser = (() => {
            try {
                return JSON.parse(localStorage.getItem("event-ease-token")) || null;
            } catch {
                router.push("/auth/login");
                return null;
            }
        })();
        setUser(currentUser);
        return currentUser
    };


    const login = async (email, password) => {
        setLoading(true);
        try {
            const response = await apiCall("/auth/login", "POST", { user: { email, password } });
            console.log({ response })
            setUser({ email: email, token: response.token });
            localStorage.setItem(
                "event-ease-token",
                JSON.stringify({ email, token: response.token })
            );
            toast.success("Logged in successfully!");
            router.push('/home');
        } catch (err) {
            console.log({ err })
            toast.error(err.message || "Failed to login. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const signup = async (email, password) => {
        setLoading(true);
        try {
            await apiCall("/auth/create-user", "POST", { user: { email, password } });
            toast.success("Signup successful! Please login.");
            router.push("/auth/login");
        } catch (err) {
            toast.error(err.message || "Failed to signup. Please try again.");
        } finally {
            setLoading(false);
        }
    };


    const logout = () => {
        setUser(null);
        localStorage.removeItem("event-ease-token");
        toast.success("Logged out successfully!");
    };

    const value = { user, loading, login, signup, logout, checkUser };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);
