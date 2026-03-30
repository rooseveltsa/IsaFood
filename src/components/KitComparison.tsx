
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { whatsappUrl } from "@/lib/constants";

export const KitComparison = () => {
  const features = [
    "Marmitas incluidas",
    "Peso por marmita",
    "Proteina por refeicao",
    "Receitas variadas",
    "Entrega gratis",
    "Suporte WhatsApp",
    "Flexibilidade de escolha",
    "Menu personalizado",
    "Suporte prioritario 24/7",
  ];

  const kits = [
    {
      name: "Kit 10",
      price: "R$ 169",
      perUnit: "R$ 16,90/un",
      values: ["10", "300-340g", "120g", "\u2713", "\u2713", "\u2713", "\u2717", "\u2717", "\u2717"],
    },
    {
      name: "Kit 20",
      price: "R$ 299",
      perUnit: "R$ 14,95/un",
      popular: true,
      values: ["20", "300-340g", "120g", "\u2713", "\u2713", "\u2713", "\u2713", "\u2717", "\u2717"],
    },
    {
      name: "Kit 40",
      price: "R$ 449",
      perUnit: "R$ 11,22/un",
      promo: true,
      values: ["40", "300-340g", "120g", "\u2713", "\u2713", "\u2713", "\u2713", "\u2713", "\u2713"],
    },
  ];

  const handlePurchase = (kitName: string, price: string) => {
    const message = `Ola! Gostaria de adquirir o ${kitName} por ${price}. Podemos finalizar o pedido?`;
    window.open(whatsappUrl(message), "_blank");
  };

  return (
    <section id="comparison" className="section-padding bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 md:mb-14">
          <span className="inline-block text-emerald-600 font-semibold text-sm uppercase tracking-widest mb-3">
            Comparativo
          </span>
          <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-gray-900 mb-3">
            Compare <span className="text-gradient">Nossos Kits</span>
          </h2>
          <p className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto">
            Todos os kits com marmitas de 300-340g e 120g de proteina
          </p>
        </div>

        <div className="overflow-x-auto -mx-4 px-4 pb-2">
          <table className="w-full max-w-5xl mx-auto border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="p-3 md:p-4 text-left text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider align-bottom">
                  Recursos
                </th>
                {kits.map((kit, index) => (
                  <th key={index} className="p-2 md:p-4 text-center align-bottom">
                    <div
                      className={`rounded-2xl p-4 md:p-5 relative ${
                        kit.popular
                          ? "bg-emerald-50 border-2 border-emerald-200"
                          : kit.promo
                          ? "bg-amber-50 border-2 border-amber-200"
                          : "bg-gray-50 border border-gray-100"
                      }`}
                    >
                      {kit.popular && (
                        <span className="inline-block mb-2 bg-emerald-600 text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                          Mais Vendido
                        </span>
                      )}
                      {kit.promo && (
                        <span className="inline-block mb-2 bg-gradient-to-r from-amber-500 to-red-500 text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                          Promocao
                        </span>
                      )}
                      <div className="font-heading font-bold text-gray-900 text-sm md:text-base">
                        {kit.name}
                      </div>
                      <div className="text-xl md:text-2xl font-heading font-extrabold text-gray-900 mt-1">
                        {kit.price}
                      </div>
                      <div className="text-[11px] md:text-xs text-emerald-600 font-medium mt-1">
                        {kit.perUnit}
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((feature, featureIndex) => (
                <tr
                  key={featureIndex}
                  className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                >
                  <td className="p-3 md:p-4 text-xs md:text-sm font-medium text-gray-700">
                    {feature}
                  </td>
                  {kits.map((kit, kitIndex) => (
                    <td key={kitIndex} className="p-3 md:p-4 text-center">
                      {kit.values[featureIndex] === "\u2713" ? (
                        <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                          <Check className="h-3.5 w-3.5 md:h-4 md:w-4 text-emerald-600" />
                        </div>
                      ) : kit.values[featureIndex] === "\u2717" ? (
                        <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
                          <X className="h-3.5 w-3.5 md:h-4 md:w-4 text-gray-300" />
                        </div>
                      ) : (
                        <span className="text-xs md:text-sm font-semibold text-gray-700">
                          {kit.values[featureIndex]}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td className="p-3 md:p-4" />
                {kits.map((kit, index) => (
                  <td key={index} className="p-2 md:p-4 text-center">
                    <Button
                      onClick={() => handlePurchase(kit.name, kit.price)}
                      size="sm"
                      className={`w-full font-bold py-2.5 md:py-3 rounded-xl text-xs md:text-sm transition-all duration-300 ${
                        kit.popular
                          ? "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg shadow-emerald-600/25"
                          : kit.promo
                          ? "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-500/25"
                          : "bg-gray-900 hover:bg-gray-800 text-white"
                      }`}
                    >
                      Escolher
                    </Button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
