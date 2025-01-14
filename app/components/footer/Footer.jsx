import { Feather, Linkedin, Github, Phone, Mail } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
    return (
        <footer className="bg-gradient-to-r from-gray-800 via-gray-900 to-black text-gray-300 py-10 mt-6">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    {/* Logo and Title */}
                    <div className="flex items-center mb-6 md:mb-0">
                        <Feather className="h-10 w-10 text-blue-500 mr-3" />
                        <span className="text-2xl font-extrabold text-white">Event Ease</span>
                    </div>
                    {/* Contact Information */}
                    <div className="text-center md:text-right">
                        <h2 className="text-lg font-bold text-blue-400 mb-2">Contact Information</h2>
                        <div className="flex items-center justify-center md:justify-end mb-2">
                            <Phone className="h-5 w-5 text-blue-500 mr-2" />
                            <span>01521255003</span>
                        </div>
                        <div className="flex items-center justify-center md:justify-end mb-4">
                            <Mail className="h-5 w-5 text-blue-500 mr-2" />
                            <span>shihab11231@gmail.com</span>
                        </div>
                        {/* Social Links */}
                        <div className="flex justify-center md:justify-end">
                            <Link href="https://www.linkedin.com/in/shihab-sabbir-034879224/" className="flex items-center text-gray-400 hover:text-blue-500 mr-6">
                                <Linkedin className="h-6 w-6 mr-2" />
                                LinkedIn
                            </Link>
                            <Link href="https://github.com/Shihab-Sabbir" className="flex items-center text-gray-400 hover:text-gray-200">
                                <Github className="h-6 w-6 mr-2" />
                                GitHub
                            </Link>
                        </div>
                    </div>
                </div>
                {/* Footer Bottom */}
                <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-500">
                    © {new Date().getFullYear()} Event Ease. All rights reserved.
                </div>
            </div>
        </footer>
    )
}
