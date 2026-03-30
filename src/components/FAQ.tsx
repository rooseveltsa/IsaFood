
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { whatsappUrl } from "@/lib/constants";

export const FAQ = () => {
  const [open, setOpen] = useState<number | null>(null);

  const faqs = [
    {
      q: "Como funciona o pedido?",
      a: "Voce escolhe o kit (10, 20 ou 40 marmitas), manda mensagem no WhatsApp, a gente monta o cardapio junto, voce paga via Pix e recebe em casa em ate 24h.",
    },
    {
      q: "Posso congelar as marmitas?",
      a: "Pode sim! Duram ate 30 dias no congelador. So descongelar na geladeira na vespera ou aquecer direto no micro-ondas.",
    },
    {
      q: "E se eu tiver restricao alimentar?",
      a: "A gente adapta. Sem gluten, sem lactose, vegetariano... e so avisar no WhatsApp que a gente monta seu cardapio personalizado.",
    },
    {
      q: "Entregam em qual regiao?",
      a: "Plano Piloto, Aguas Claras, Taguatinga, Ceilandia, Guara, Sobradinho e Planaltina. Entrega gratis em todas.",
    },
    {
      q: "Quanto tempo dura na geladeira?",
      a: "Ate 3 dias na geladeira. A gente recomenda congelar o que nao for comer nos proximos 2 dias.",
    },
    {
      q: "Quais as formas de pagamento?",
      a: "Pix e o principal (cai na hora e a gente confirma rapidinho). Tambem aceita transferencia e dinheiro na entrega.",
    },
  ];

  return (
    <section id="faq" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-10">
            <p className="text-emerald-600 text-sm font-semibold uppercase tracking-wider mb-3">
              Duvidas
            </p>
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-gray-900">
              Perguntas frequentes
            </h2>
          </div>

          <div className="divide-y divide-gray-100">
            {faqs.map((faq, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between py-5 text-left group"
                >
                  <span className="text-base font-semibold text-gray-900 pr-4 group-hover:text-emerald-700 transition-colors">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${
                      open === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-200 ${
                    open === i ? "max-h-40 pb-5" : "max-h-0"
                  }`}
                >
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 pt-8 border-t border-gray-100">
            <p className="text-gray-500 text-sm mb-3">Ficou com alguma duvida?</p>
            <button
              onClick={() =>
                window.open(
                  whatsappUrl("Oi! Tenho uma duvida sobre os kits de marmitas."),
                  "_blank"
                )
              }
              className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm underline underline-offset-4 transition-colors"
            >
              Fala com a gente no WhatsApp
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
