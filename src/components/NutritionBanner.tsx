
import { Beef, Scale, Flame, Droplets, Leaf } from "lucide-react";

export const NutritionBanner = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 py-12 md:py-16">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Ccircle cx='20' cy='20' r='1.5'/%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Title */}
        <div className="text-center mb-8">
          <span className="inline-block text-emerald-300 font-semibold text-xs uppercase tracking-[0.2em] mb-3">
            Nutricao de verdade
          </span>
          <h2 className="text-2xl md:text-4xl font-heading font-extrabold text-white mb-3">
            Cada marmita e uma refeicao{" "}
            <span className="text-gradient-accent">completa</span>
          </h2>
          <p className="text-emerald-200/70 max-w-lg mx-auto text-sm md:text-base">
            Desenvolvidas com foco em performance, saciedade e sabor. Sem atalhos, sem ultraprocessados.
          </p>
        </div>

        {/* Nutrition cards */}
        <div className="flex md:grid md:grid-cols-5 gap-3 md:gap-4 max-w-4xl mx-auto overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory -mx-4 px-4 md:mx-auto md:px-0 md:overflow-visible">
          {[
            { icon: Beef, value: "120g", label: "Proteina", sub: "por marmita", color: "from-red-400 to-red-500" },
            { icon: Scale, value: "300-340g", label: "Porcao", sub: "generosa", color: "from-emerald-400 to-emerald-500" },
            { icon: Flame, value: "~450", label: "Calorias", sub: "balanceadas", color: "from-amber-400 to-orange-500" },
            { icon: Droplets, value: "0%", label: "Conservantes", sub: "artificiais", color: "from-sky-400 to-blue-500" },
            { icon: Leaf, value: "100%", label: "Natural", sub: "ingredientes frescos", color: "from-lime-400 to-green-500" },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-4 md:p-5 text-center hover:bg-white/15 transition-all duration-300 group flex-shrink-0 w-[140px] md:w-auto snap-center"
            >
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
                <item.icon className="h-5 w-5 text-white" />
              </div>
              <p className="text-2xl font-heading font-extrabold text-white">
                {item.value}
              </p>
              <p className="text-emerald-200 text-xs font-semibold uppercase tracking-wider mt-1">
                {item.label}
              </p>
              <p className="text-emerald-400/50 text-[10px] mt-0.5">
                {item.sub}
              </p>
            </div>
          ))}
        </div>

        {/* Tagline */}
        <p className="text-center text-emerald-300/60 text-xs mt-8 max-w-md mx-auto">
          Valores nutricionais aproximados. Dietas personalizadas sao ajustadas individualmente conforme seus objetivos.
        </p>
      </div>
    </section>
  );
};
