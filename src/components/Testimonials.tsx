
import { Star } from "lucide-react";
import { BUSINESS } from "@/lib/constants";

const reviews = [
  {
    name: "Carolina M.",
    area: "Aguas Claras",
    text: "Gente, ja perdi 8kg em 3 meses comendo essas marmitas. E o sabor? Nao parece comida de dieta. Viciei no escondidinho fit.",
    stars: 5,
  },
  {
    name: "Rafael S.",
    area: "Plano Piloto",
    text: "Peguei o Kit 20 pra testar e agora nao largo mais. Pratico demais, chego do treino e ja tenho comida pronta. Recomendo muito.",
    stars: 5,
  },
  {
    name: "Juliana P.",
    area: "Taguatinga",
    text: "A Isa e super atenciosa, tira todas as duvidas no WhatsApp. Marmita chega sempre certinha, bem embalada. Top demais!",
    stars: 5,
  },
  {
    name: "Lucas F.",
    area: "Guara",
    text: "Kit 40 pro mes inteiro e o melhor custo beneficio que achei em BSB. 120g de proteina de verdade, nao e conversa nao.",
    stars: 5,
  },
];

export const Testimonials = () => {
  return (
    <section id="testimonials" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="md:flex md:items-end md:justify-between mb-10">
            <div>
              <p className="text-emerald-600 text-sm font-semibold uppercase tracking-wider mb-3">
                Quem ja provou
              </p>
              <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-gray-900">
                +500 pessoas em Brasilia
                <br />
                <span className="text-gray-400">confiam na Isa.</span>
              </h2>
            </div>
            <a
              href={BUSINESS.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 md:mt-0 text-sm text-gray-500 hover:text-gray-900 underline underline-offset-4 transition-colors"
            >
              Veja mais no @{BUSINESS.instagram}
            </a>
          </div>

          {/* Reviews - 2 col grid, asymmetric */}
          <div className="grid md:grid-cols-2 gap-4">
            {reviews.map((r, i) => (
              <div
                key={i}
                className={`rounded-2xl p-6 ${
                  i === 0 ? "bg-gray-950 text-white" : "bg-white border border-gray-100"
                }`}
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: r.stars }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className={`leading-relaxed mb-6 ${
                  i === 0 ? "text-gray-300 text-base" : "text-gray-600 text-sm"
                }`}>
                  "{r.text}"
                </p>

                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${
                    i === 0
                      ? "bg-emerald-500 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}>
                    {r.name.charAt(0)}
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${i === 0 ? "text-white" : "text-gray-900"}`}>
                      {r.name}
                    </p>
                    <p className={`text-xs ${i === 0 ? "text-gray-500" : "text-gray-400"}`}>
                      {r.area}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
