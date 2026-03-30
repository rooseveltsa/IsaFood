
import { ClipboardList, MessageCircle, Truck } from "lucide-react";

export const HowItWorks = () => {
  const steps = [
    {
      icon: ClipboardList,
      step: "01",
      title: "Escolha seu Kit",
      description: "Selecione entre nossos 3 kits o que melhor se adequa aos seus objetivos.",
      color: "from-emerald-500 to-emerald-600",
    },
    {
      icon: MessageCircle,
      step: "02",
      title: "Personalize pelo WhatsApp",
      description: "Informe suas preferencias alimentares e endereco de entrega.",
      color: "from-amber-500 to-orange-500",
    },
    {
      icon: Truck,
      step: "03",
      title: "Receba em Casa",
      description: "Suas marmitas chegam frescas e prontas para consumo em ate 24h.",
      color: "from-emerald-600 to-emerald-700",
    },
  ];

  return (
    <section id="how-it-works" className="section-padding bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 md:mb-14">
          <span className="inline-block text-emerald-600 font-semibold text-sm uppercase tracking-widest mb-4">
            Simples e rapido
          </span>
          <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-gray-900 mb-4">
            Como <span className="text-gradient">Funciona</span>
          </h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Em apenas 3 passos, alimentacao saudavel na sua mesa.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              <div className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-emerald-200 shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-500 hover:-translate-y-1">
                {/* Step number */}
                <span className="text-6xl font-heading font-extrabold text-gray-100 absolute top-4 right-6">
                  {step.step}
                </span>

                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <step.icon className="h-7 w-7 text-white" />
                </div>

                <h3 className="text-xl font-heading font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-500 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Connector line (desktop only) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8">
                  <div className="h-0.5 bg-gradient-to-r from-emerald-300 to-emerald-100" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
