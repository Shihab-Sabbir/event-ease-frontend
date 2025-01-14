import Home from "./(pages)/(public)/home/page";
import Footer from "./components/footer/Footer";
import Navbar from "./components/navbar/Navbar";

export default function App() {
  return (
    <div className="mx-auto max-w-[1600px]">
      <Navbar />
      <div className="flex flex-col h-[calc(100vh_-_80px)] justify-between">
        <div className=" px-[40px]">
          <Home />
        </div>
        <Footer />
      </div>
    </div>
  );
}
