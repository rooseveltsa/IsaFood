
import { MapPin, Clock, Truck } from "lucide-react";
import { BUSINESS } from "@/lib/constants";

export const DeliveryAreas = () => {
  return (
    <section id="delivery" className="section-padding bg-gray-50/50">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div>
              <span className="inline-block text-emerald-600 font-semibold text-sm uppercase tracking-widest mb-4">
                Area de entrega
              </span>
              <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-gray-900 mb-4">
                Entrega gratis em{" "}
                <span className="text-gradient">toda Brasilia</span>
              </h2>
              <p className="text-gray-500 mb-8 leading-relaxed">
                Atendemos as principais regioes do Distrito Federal com entrega
                rapida e gratuita em todos os nossos kits.
              </p>

              {/* Areas Grid */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                {BUSINESS.deliveryAreas.map((area, i) => (
                  <div
                    key={i}
                    className="flex items-center space-x-2 bg-white rounded-xl px-4 py-3 border border-gray-100 shadow-sm"
                  >
                    <MapPin className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-700">
                      {area}
                    </span>
                  </div>
                ))}
              </div>

              <p className="text-sm text-gray-400">
                Nao esta na lista? Entre em contato para verificar disponibilidade.
              </p>
            </div>

            {/* Info Cards */}
            <div className="space-y-4">
              {[
                {
                  icon: Truck,
                  title: "Entrega Gratis",
                  description:
                    "Todos os kits incluem entrega gratuita dentro da area de cobertura.",
                  color: "from-emerald-500 to-emerald-600",
                },
                {
                  icon: Clock,
                  title: "Ate 24h",
                  description:
                    "Pedidos confirmados ate 14h podem ser entregues no mesmo dia.",
                  color: "from-amber-500 to-orange-500",
                },
                {
                  icon: MapPin,
                  title: "7 Regioes",
                  description:
                    "Cobrimos as principais regioes do DF com entrega agil e segura.",
                  color: "from-emerald-600 to-emerald-700",
                },
              ].map((card, i) => (
                <div
                  key={i}
                  className="flex items-start space-x-4 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center flex-shrink-0 shadow-md`}
                  >
                    <card.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-gray-900 mb-1">
                      {card.title}
                    </h3>
                    <p className="text-sm text-gray-500">{card.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
