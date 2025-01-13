'use client'

import React, { useState } from "react";
import { useUser } from "@/app/context/UserContext";

const SignupPage = () => {
    const { signup, loading } = useUser();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        await signup(email, password);
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form
                className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm"
                onSubmit={handleSubmit}
            >
                <h2 className="text-xl font-bold mb-4">Signup</h2>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full border rounded px-3 py-2"
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-sm font-medium mb-2" htmlFor="password">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full border rounded px-3 py-2"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
                >
                    {loading ? "Signing up..." : "Signup"}
                </button>
            </form>
        </div>
    );
};

export default SignupPage;
