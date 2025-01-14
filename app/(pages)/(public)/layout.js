import Navbar from "@/app/components/navbar/Navbar";

export default function PublicLayout({ children }) {
    return (
        <div className="mx-auto max-w-[1400px] px-[40px]">
            <Navbar />
            {children}
        </div>
    );
}
