
import { MessageCircle } from "lucide-react";
import { whatsappUrl } from "@/lib/constants";

export const WhatsAppButton = () => {
  const openWhatsApp = () => {
    window.open(
      whatsappUrl("Ola! Gostaria de saber mais sobre as marmitas fitness da Isa Fitness!"),
      "_blank"
    );
  };

  return (
    <button
      onClick={openWhatsApp}
      className="fixed bottom-5 left-5 z-50 group"
      aria-label="Abrir WhatsApp"
    >
      <div className="relative">
        {/* Pulse ring */}
        <div className="absolute inset-0 bg-green-500 rounded-2xl animate-ping opacity-20" />

        {/* Button */}
        <div className="relative w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-xl shadow-green-600/30 flex items-center justify-center hover:shadow-green-600/50 hover:scale-110 transition-all duration-300">
          <MessageCircle className="h-6 w-6 text-white" />
        </div>
      </div>

      {/* Tooltip */}
      <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-2 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
        Fale conosco no WhatsApp
      </div>
    </button>
  );
};
