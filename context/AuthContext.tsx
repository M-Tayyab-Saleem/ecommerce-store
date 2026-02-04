"use client";

import React, { createContext, useState, useEffect, ReactNode, useContext } from "react";
import axiosInstance from "@/lib/api/axios-instance";
import { useRouter } from "next/navigation";

interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: "user" | "admin";
}

interface LoginInput {
    email: string;
    password: string;
}

interface RegisterInput {
    name: string;
    email: string;
    phone: string;
    password: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (data: LoginInput) => Promise<void>;
    register: (data: RegisterInput) => Promise<void>;
    logout: () => Promise<void>;
    checkUserLoggedIn: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();

    const checkUserLoggedIn = async () => {
        try {
            const response = await axiosInstance.get("/auth/me");
            if (response.data?.success) {
                setUser(response.data.data.user);
            } else {
                setUser(null);
            }
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkUserLoggedIn();
    }, []);

    const login = async (userData: LoginInput) => {
        try {
            const response = await axiosInstance.post("/auth/login", userData);
            if (response.data?.success) {
                setUser(response.data.data.user);
            }
            return response.data;
        } catch (error: any) {
            throw error.response?.data?.message || "Login failed";
        }
    };

    const register = async (userData: RegisterInput) => {
        try {
            const response = await axiosInstance.post("/auth/register", userData);
            if (response.data?.success) {
                setUser(response.data.data.user);
            }
            return response.data;
        } catch (error: any) {
            const message = error.response?.data?.message || "Registration failed";
            throw error.response?.data || { message };
        }
    };

    const logout = async () => {
        try {
            await axiosInstance.post("/auth/logout");
            setUser(null);
            router.push("/login"); // Redirect to login page
            router.refresh();
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                register,
                logout,
                checkUserLoggedIn,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
