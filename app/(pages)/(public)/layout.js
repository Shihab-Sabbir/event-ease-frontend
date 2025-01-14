import Footer from "@/app/components/footer/Footer";
import Navbar from "@/app/components/navbar/Navbar";

export default function PublicLayout({ children }) {
    return (
        <div className="mx-auto max-w-[1600px]">
            <Navbar />
            <div className="flex flex-col                   h-[calc(100vh_-_80px)] justify-between">
                <div className="px-[40px]">
                    {children}
                </div>
                <Footer />
            </div>
        </div>
    );
}
