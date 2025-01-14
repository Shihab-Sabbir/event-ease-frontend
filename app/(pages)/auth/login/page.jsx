'use client'

import { useState } from "react"
import { useUser } from "@/app/context/UserContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AtSign, Lock } from 'lucide-react'

const LoginPage = () => {
    const { login, loading } = useUser()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        await login(email, password)
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Left half - Image */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <Card className="w-full max-w-md !border-none !shadow-none">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold">Login</CardTitle>
                        <CardDescription>Enter your email and password to access your account</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <AtSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Logging in..." : "Login"}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter>
                        <p className="text-sm text-gray-500 text-center w-full">
                            Don&#39;t have an account? <a href="/auth/signup" className="text-blue-500 hover:underline">Sign up</a>
                        </p>
                    </CardFooter>

                </Card>
            </div>
            {/* Right half - Login Form */}
            <div className="hidden lg:block w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('https://plus.unsplash.com/premium_photo-1720192861639-1524439fc166?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}>
                {/* You can replace the placeholder with your actual login image */}
            </div>
        </div>
    )
}

export default LoginPage

