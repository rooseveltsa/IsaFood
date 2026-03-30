
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";
import { whatsappUrl } from "@/lib/constants";

export const Kits = () => {
  const kits = [
    {
      id: 1,
      name: "Kit 10",
      marmitas: 10,
      price: "169",
      originalPrice: "210",
      perUnit: "16,90",
      features: ["10 marmitas de 300-340g", "120g de proteina cada", "Entrega gratis"],
      popular: false,
    },
    {
      id: 2,
      name: "Kit 20",
      marmitas: 20,
      price: "299",
      originalPrice: "390",
      perUnit: "14,95",
      features: ["20 marmitas de 300-340g", "120g de proteina cada", "Entrega gratis", "Suporte prioritario", "Escolha do cardapio"],
      popular: true,
    },
    {
      id: 3,
      name: "Kit 40",
      marmitas: 40,
      price: "449",
      originalPrice: "680",
      perUnit: "11,22",
      features: ["40 marmitas de 300-340g", "120g de proteina cada", "Entrega prioritaria", "Suporte 24/7", "Cardapio personalizado", "Melhor preco de BSB"],
      popular: false,
      promo: true,
    },
  ];

  const handleSelectKit = (kit: (typeof kits)[0]) => {
    const message = `Oi! Quero o ${kit.name} (${kit.marmitas} marmitas) por R$ ${kit.price}. Como faco pra pedir?`;
    window.open(whatsappUrl(message), "_blank");
  };

  return (
    <section id="kits" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Header - left aligned, not centered */}
        <div className="max-w-6xl mx-auto mb-10">
          <p className="text-emerald-600 text-sm font-semibold uppercase tracking-wider mb-3">
            Kits semanais
          </p>
          <div className="md:flex md:items-end md:justify-between">
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-gray-900 leading-tight">
              Escolhe o tamanho.
              <br className="hidden md:block" />
              <span className="text-gray-400"> A qualidade e a mesma.</span>
            </h2>
            <p className="text-gray-500 text-sm mt-3 md:mt-0 max-w-xs">
              Todas as marmitas com 300-340g e 120g de proteina. Sem conservantes.
            </p>
          </div>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-4 lg:gap-6 max-w-6xl mx-auto">
          {kits.map((kit) => (
            <div
              key={kit.id}
              className={`relative rounded-2xl overflow-hidden transition-all duration-300 flex flex-col ${
                kit.popular
                  ? "bg-gray-950 text-white ring-2 ring-emerald-500"
                  : "bg-gray-50 text-gray-900 hover:bg-gray-100"
              }`}
            >
              {kit.popular && (
                <div className="bg-emerald-500 text-white text-center py-1.5 text-xs font-bold uppercase tracking-widest">
                  Mais vendido
                </div>
              )}
              {kit.promo && (
                <div className="bg-amber-500 text-white text-center py-1.5 text-xs font-bold uppercase tracking-widest">
                  Melhor preco
                </div>
              )}

              <div className="p-6 lg:p-8 flex flex-col flex-1">
                {/* Name + quantity */}
                <div className="mb-6">
                  <h3 className="text-lg font-heading font-bold">{kit.name}</h3>
                  <p className={`text-sm ${kit.popular ? "text-gray-400" : "text-gray-500"}`}>
                    {kit.marmitas} marmitas por semana
                  </p>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-heading font-extrabold">
                      R$ {kit.price}
                    </span>
                    <span className={`text-sm line-through ${kit.popular ? "text-gray-600" : "text-gray-300"}`}>
                      R$ {kit.originalPrice}
                    </span>
                  </div>
                  <p className={`text-sm mt-1 ${kit.popular ? "text-emerald-400" : "text-emerald-600"} font-medium`}>
                    R$ {kit.perUnit} por marmita
                  </p>
                </div>

                {/* Features */}
                <ul className="space-y-2.5 mb-8 flex-1">
                  {kit.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <Check className={`h-4 w-4 mt-0.5 flex-shrink-0 ${kit.popular ? "text-emerald-400" : "text-emerald-600"}`} />
                      <span className={`text-sm ${kit.popular ? "text-gray-300" : "text-gray-600"}`}>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button
                  onClick={() => handleSelectKit(kit)}
                  className={`w-full font-bold py-3.5 rounded-xl text-sm transition-all ${
                    kit.popular
                      ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                      : "bg-gray-900 hover:bg-gray-800 text-white"
                  }`}
                >
                  Pedir pelo WhatsApp
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom note - simple */}
        <p className="text-center text-xs text-gray-400 mt-8 max-w-md mx-auto">
          Entrega gratis em Plano Piloto, Aguas Claras, Taguatinga, Ceilandia, Guara, Sobradinho e Planaltina.
        </p>
      </div>
    </section>
  );
};
