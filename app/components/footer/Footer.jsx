import { Feather } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
    return (
        <footer className="bg-black bg-opacity-20 text-gray-600 py-8 mt-8">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center mb-4 md:mb-0">
                        <Feather className="h-8 w-8 text-blue-500 mr-2" />
                        <span className="text-xl font-bold text-gray-800">Event Ease</span>
                    </div>
                    <div className="text-center md:text-right">
                        <p className="font-medium">MD SABBIR REZA SHAFI</p>
                        <p>Phone: 01521255003</p>
                        <p>Email: shihab11231@gmail.com</p>
                        <div className="mt-2">
                            <Link href="https://www.linkedin.com/in/shihab-sabbir-034879224/" className="text-blue-500 hover:text-blue-600 mr-4">
                                LinkedIn
                            </Link>
                            <Link href="https://github.com/Shihab-Sabbir" className="text-gray-700 hover:text-gray-900">
                                GitHub
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

