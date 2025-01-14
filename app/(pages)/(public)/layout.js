import Footer from "@/app/components/footer/Footer";
import Navbar from "@/app/components/navbar/Navbar";

export default function PublicLayout({ children }) {
    return (
        <div className="mx-auto max-w-[1600px] px-[40px]">
            <Navbar />
            {children}
            <Footer />
        </div>
    );
}
