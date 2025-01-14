'use client'

import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect } from "react";
import { useUser } from "@/app/context/UserContext";
import { Menu, LogOut, LogIn, Home, Calendar } from "lucide-react";

export default function Navbar() {
    const { user, logout, checkUser } = useUser();

    useEffect(() => {
        const checkUserStatus = async () => {
            await checkUser();
        };
        checkUserStatus();
    }, []);

    const handleLogout = async () => {
        logout();
        await checkUser();
    };

    return (
        <header className="flex items-center h-16 px-4 md:px-6 bg-gradient-to-r from-gray-800 via-gray-900 to-black text-gray-200 shadow-lg">
            {/* Mobile Navigation Menu */}
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="lg:hidden">
                        <Menu className="h-6 w-6" aria-label="Toggle navigation menu" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="bg-gray-900 text-gray-200">
                    <nav className="flex flex-col space-y-4">
                        <Link href="/" className="flex items-center text-lg font-medium hover:text-blue-400">
                            <Home className="mr-2 h-5 w-5" />
                            Home
                        </Link>
                        <Link href="/all-events" className="flex items-center text-lg font-medium hover:text-blue-400">
                            <Calendar className="mr-2 h-5 w-5" />
                            All Events
                        </Link>
                    </nav>
                </SheetContent>
            </Sheet>

            {/* Logo */}
            <Link href="/" className="flex items-center mr-6 w-full justify-center lg:w-fit">
                <MountainIcon className="h-12 w-12 text-blue-400" aria-label="Event Ease Logo" />
                <span className="ml-2 text-2xl font-bold text-white">Event Ease</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex ml-auto space-x-6 items-center">
                <Link href="/" className="nav-link">
                    Home
                </Link>
                <Link href="/all-events" className="nav-link">
                    All Events
                </Link>

                {/* Conditional User Actions */}
                {user ? (
                    <Button onClick={handleLogout} variant="secondary" className="flex items-center">
                        <LogOut className="mr-2 h-5 w-5" />
                        Logout
                    </Button>
                ) : (
                    <Link href="/auth/login">
                        <Button className="flex items-center hover:bg-white hover:text-black">
                            <LogIn className="mr-2 h-5 w-5" />
                            Login
                        </Button>
                    </Link>
                )}
            </nav>
        </header>
    );
}

function MountainIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
        </svg>
    );
}
