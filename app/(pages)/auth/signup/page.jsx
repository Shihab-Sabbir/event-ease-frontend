'use client'

import { useState } from "react"
import Link from "next/link"
import { useUser } from "@/app/context/UserContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AtSign, Lock } from 'lucide-react'

const SignupPage = () => {
    const { signup, loading } = useUser()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        await signup(email, password)
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Right half - Image */}
            <div
                className="hidden lg:block w-1/2 bg-cover bg-center"
                style={{
                    backgroundImage: "url('https://sjc.microlink.io/Vx6d8Ju7ZW89Kw4_g09v88PJXqyq4qN6KoQzrs-IhuRnt0MEYSbSiQ7qjOlHEorNPhyfV8l8H0TgpPGL4P9sug.jpeg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            />

            {/* Left half - Signup Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <Card className="w-full max-w-md !border-none !shadow-none">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
                        <CardDescription>Enter your email and password to sign up</CardDescription>
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
                                        placeholder="Create a password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Signing up..." : "Sign up"}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter>
                        <p className="text-sm text-gray-500 text-center w-full">
                            Already have an account?{" "}
                            <Link href="/auth/login" className="text-blue-500 hover:underline">
                                Log in
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}

export default SignupPage

