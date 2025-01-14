import Home from "./(pages)/(public)/home/page";
import Navbar from "./components/navbar/Navbar";

export default function App() {
  return (
    <div className="mx-auto max-w-[1400px] px-[40px]">
      <Navbar />
      <Home />
    </div>
  );
}
