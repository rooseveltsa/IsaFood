
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
    setIsOpen(false);
  };

  const menuItems = [
    { label: "Inicio", id: "hero" },
    { label: "Kits", id: "kits" },
    { label: "Depoimentos", id: "testimonials" },
    { label: "Cardapio", id: "menu" },
    { label: "FAQ", id: "faq" },
    { label: "Contato", id: "contato" },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden p-2 -mr-2"
      >
        <Menu className="h-5 w-5 text-gray-700" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white z-50 transform transition-transform duration-300 lg:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-10">
            <span className="font-heading font-extrabold text-gray-900">
              Isa Fitness
            </span>
            <button onClick={() => setIsOpen(false)} className="p-1">
              <X className="h-5 w-5 text-gray-400" />
            </button>
          </div>

          <nav className="space-y-1 flex-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="block w-full text-left px-3 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors text-sm"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <button
            onClick={() => {
              navigate("/menu");
              setIsOpen(false);
            }}
            className="w-full bg-gray-900 text-white font-semibold py-3 rounded-lg text-sm"
          >
            Pedir agora
          </button>
        </div>
      </div>
    </>
  );
};
