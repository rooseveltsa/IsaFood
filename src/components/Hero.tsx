
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { whatsappUrl } from "@/lib/constants";

export const Hero = () => {
  const handlePedir = () => {
    window.open(
      whatsappUrl("Oi! Quero montar meu kit de marmitas fitness!"),
      "_blank"
    );
  };

  const scrollToKits = () => {
    document.getElementById("kits")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" className="relative overflow-hidden">
      {/* Mobile */}
      <div className="lg:hidden">
        {/* Image full bleed */}
        <div className="relative h-[45vh] min-h-[320px]">
          <img
            src="/lovable-uploads/c7d79ba7-0651-4f37-871a-75518cae282a.png"
            alt="Marmitas fitness Isa Fitness"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          {/* Text over image */}
          <div className="absolute bottom-0 left-0 right-0 p-6 pb-8">
            <p className="text-emerald-400 text-sm font-semibold mb-2 uppercase tracking-wider">
              Brasilia - DF
            </p>
            <h1 className="text-3xl font-heading font-extrabold text-white leading-[1.15] mb-3">
              Seu treino pede
              <br />
              comida de verdade.
            </h1>
            <p className="text-white/70 text-sm leading-relaxed max-w-xs">
              120g de proteina. 300g+ por marmita. Feita no dia, entregue na sua porta.
            </p>
          </div>
        </div>

        {/* CTAs + info below image */}
        <div className="px-6 py-6 space-y-4 bg-white">
          {/* Promo strip */}
          <div className="flex items-center justify-between bg-gray-950 text-white rounded-2xl px-5 py-4">
            <div>
              <p className="text-xs text-gray-400">Kit 40 marmitas</p>
              <p className="text-2xl font-heading font-extrabold">
                R$ 449
              </p>
              <p className="text-emerald-400 text-xs font-medium">
                R$ 11,22 cada
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-sm line-through">R$ 680</p>
              <span className="inline-block bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded mt-1 uppercase">
                -34%
              </span>
            </div>
          </div>

          <Button
            onClick={handlePedir}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl text-base shadow-none"
          >
            Quero minhas marmitas
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          <button
            onClick={scrollToKits}
            className="w-full text-center text-sm text-gray-500 hover:text-gray-900 py-2 transition-colors"
          >
            Ver todos os kits e precos
          </button>

          {/* Quick stats */}
          <div className="flex justify-between pt-2 border-t border-gray-100">
            {[
              { number: "+500", label: "clientes" },
              { number: "24h", label: "entrega" },
              { number: "4.9", label: "estrelas" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-lg font-heading font-bold text-gray-900">{s.number}</p>
                <p className="text-[11px] text-gray-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden lg:block bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-0 min-h-[85vh] items-center">
            {/* Left - Content */}
            <div className="py-20 pr-16">
              <p className="text-emerald-600 text-sm font-semibold mb-6 uppercase tracking-wider">
                Brasilia - DF
              </p>

              <h1 className="text-5xl xl:text-[3.5rem] font-heading font-extrabold text-gray-900 leading-[1.1] mb-6">
                Seu treino pede
                <br />
                comida de verdade.
              </h1>

              <p className="text-gray-500 text-lg leading-relaxed mb-8 max-w-md">
                120g de proteina por marmita. Ingredientes comprados no dia. Entrega gratis em toda Brasilia.
              </p>

              {/* Promo card */}
              <div className="flex items-center gap-6 bg-gray-950 text-white rounded-2xl px-6 py-5 max-w-sm mb-8">
                <div>
                  <p className="text-xs text-gray-400">Kit 40 marmitas</p>
                  <p className="text-3xl font-heading font-extrabold">R$ 449</p>
                  <p className="text-emerald-400 text-sm font-medium">R$ 11,22 cada</p>
                </div>
                <div className="text-right ml-auto">
                  <p className="text-gray-500 line-through">R$ 680</p>
                  <span className="inline-block bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded mt-1">
                    -34%
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-10">
                <Button
                  onClick={handlePedir}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-4 rounded-2xl text-base shadow-none hover:-translate-y-0.5 transition-transform"
                >
                  Quero minhas marmitas
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <button
                  onClick={scrollToKits}
                  className="text-sm text-gray-500 hover:text-gray-900 transition-colors underline underline-offset-4"
                >
                  Ver todos os kits
                </button>
              </div>

              {/* Stats */}
              <div className="flex gap-10">
                {[
                  { number: "+500", label: "clientes em Brasilia" },
                  { number: "24h", label: "prazo de entrega" },
                  { number: "4.9", label: "no Google" },
                ].map((s, i) => (
                  <div key={i}>
                    <p className="text-2xl font-heading font-bold text-gray-900">{s.number}</p>
                    <p className="text-xs text-gray-400">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Images */}
            <div className="relative h-full">
              <div className="grid grid-cols-2 gap-3 h-full py-8">
                <div className="space-y-3">
                  <div className="rounded-3xl overflow-hidden h-[55%]">
                    <img
                      src="/lovable-uploads/c7d79ba7-0651-4f37-871a-75518cae282a.png"
                      alt="Variedade de marmitas fitness"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="rounded-3xl overflow-hidden h-[43%]">
                    <img
                      src="/lovable-uploads/05bba46f-c193-44e6-82ff-f50d65654f3b.png"
                      alt="Marmitas com proteinas"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-3 pt-10">
                  <div className="rounded-3xl overflow-hidden h-[48%]">
                    <img
                      src="/lovable-uploads/35dc68eb-8039-44f1-9507-c07bb60b5d1f.png"
                      alt="Marmitas gourmet"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="rounded-3xl overflow-hidden h-[50%]">
                    <img
                      src="/lovable-uploads/cedfe62d-d73e-4643-b7df-40cb8750105b.png"
                      alt="Producao de marmitas"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
