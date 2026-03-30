
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { MobileNav } from "./MobileNav";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export const Header = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm"
          : "bg-white"
      }`}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo — simple text, no gradients */}
          <button
            onClick={() => scrollToSection("hero")}
            className="flex items-center gap-2"
          >
            <span className="text-lg font-heading font-extrabold text-gray-900">
              Isa Fitness
            </span>
          </button>

          {/* Desktop nav — clean links */}
          <nav className="hidden lg:flex items-center gap-1">
            {[
              { label: "Kits", id: "kits" },
              { label: "Cardapio", id: "menu" },
              { label: "Depoimentos", id: "testimonials" },
              { label: "FAQ", id: "faq" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="px-3 py-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => navigate("/menu")}
              size="sm"
              className="bg-gray-900 hover:bg-gray-800 text-white font-semibold px-5 py-2 rounded-lg text-sm shadow-none"
            >
              <ShoppingCart className="h-4 w-4 mr-1.5" />
              Pedir
            </Button>

            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
};
