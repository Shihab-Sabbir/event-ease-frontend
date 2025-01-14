import Home from "./(pages)/(public)/home/page";
import Footer from "./components/footer/Footer";
import Navbar from "./components/navbar/Navbar";

export default function App() {
  return (
    <div className="mx-auto max-w-[1600px] px-[40px]">
      <Navbar />
      <Home />
      <Footer />
    </div>
  );
}
