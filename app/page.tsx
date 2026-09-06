import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Ticker from "@/components/Ticker";
import Models from "@/components/Models";
import Services from "@/components/Services";
import WhyUs from "@/components/WhyUs";
import Process from "@/components/Process";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import Booking from "@/components/Booking";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { Phone } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-asphalt text-platinum font-body">
      <Navbar />
      <main>
        <Hero />
        <Ticker />
        <Models />
        <Services />
        <WhyUs />
        <Process />
        <Pricing />
        <Testimonials />
        <Booking />
        <Contact />
      </main>
      <Footer />

      {/* floating call */}
      <a
        href="tel:19900"
        aria-label="Call Modern Motors"
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 pl-4 pr-5 py-3.5 rounded-full bg-nissan text-white font-bold text-sm red-glow hover:bg-red-600 transition-colors"
      >
        <Phone size={16} /> 19900
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-asphalt animate-pulse" />
      </a>
    </div>
  );
}
