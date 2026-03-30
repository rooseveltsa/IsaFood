
import { MapPin, Clock, Phone, Instagram, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { AdminButton } from "./AdminButton";
import { BUSINESS, whatsappUrl } from "@/lib/constants";

export const Footer = () => {
  return (
    <footer id="contato" className="bg-gray-950 text-white">
      {/* CTA */}
      <div className="border-b border-gray-800/50">
        <div className="container mx-auto px-4 py-14">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-heading font-extrabold mb-3">
              Bora comecar?
            </h2>
            <p className="text-gray-500 mb-6 text-sm">
              Chama no WhatsApp que a gente monta seu kit.
            </p>
            <button
              onClick={() =>
                window.open(
                  whatsappUrl("Oi! Quero montar meu kit de marmitas fitness!"),
                  "_blank"
                )
              }
              className="inline-flex items-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-4 rounded-2xl transition-colors text-sm"
            >
              <Phone className="h-4 w-4 mr-2" />
              Chamar no WhatsApp
              <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="grid md:grid-cols-3 gap-10 max-w-4xl mx-auto">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-heading font-bold">iF</span>
              </div>
              <span className="font-heading font-bold text-white">{BUSINESS.name}</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              Marmitas fitness feitas com ingredientes de verdade, em Brasilia.
            </p>
            <a
              href={BUSINESS.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-gray-500 hover:text-white text-sm transition-colors"
            >
              <Instagram className="h-4 w-4" />
              @{BUSINESS.instagram}
            </a>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">
              Contato
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2.5 text-gray-400">
                <Phone className="h-3.5 w-3.5" />
                {BUSINESS.whatsapp.display}
              </div>
              <div className="flex items-start gap-2.5 text-gray-400">
                <MapPin className="h-3.5 w-3.5 mt-0.5" />
                <span>{BUSINESS.address}</span>
              </div>
              <div className="flex items-center gap-2.5 text-gray-400">
                <Clock className="h-3.5 w-3.5" />
                {BUSINESS.hours.weekdays}
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">
              Informacoes
            </h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { to: "/como-funciona", label: "Como funciona" },
                { to: "/politica-entrega", label: "Entrega" },
                { to: "/termos", label: "Termos" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-gray-500 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800/50 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 max-w-4xl mx-auto">
          <p className="text-gray-600 text-xs">
            &copy; 2025 {BUSINESS.name}
          </p>
          <div className="flex items-center gap-3">
            <p className="text-gray-700 text-xs">
              por <span className="text-gray-500">Junior Miranda</span>
            </p>
            <AdminButton />
          </div>
        </div>
      </div>
    </footer>
  );
};
