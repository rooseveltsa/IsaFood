
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Target, Sparkles } from "lucide-react";
import { BUSINESS, whatsappUrl } from "@/lib/constants";

export const LeadCapture = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    goal: "",
    restrictions: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const goals = [
    "Emagrecimento",
    "Ganho de massa",
    "Manutencao",
    "Qualidade de vida",
    "Pre/Pos treino",
    "Outro",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.goal) {
      toast({
        title: "Preencha os campos obrigatorios",
        description: "Nome, telefone e objetivo sao necessarios.",
        variant: "destructive",
      });
      return;
    }

    // Save lead to localStorage for now (will integrate with Supabase later)
    const leads = JSON.parse(localStorage.getItem("leads") || "[]");
    leads.push({
      ...formData,
      createdAt: new Date().toISOString(),
      source: "landing_page",
    });
    localStorage.setItem("leads", JSON.stringify(leads));

    // Open WhatsApp with personalized message
    let message = `*NOVO LEAD - ISA FITNESS*\n\n`;
    message += `*Nome:* ${formData.name}\n`;
    message += `*Telefone:* ${formData.phone}\n`;
    message += `*Objetivo:* ${formData.goal}\n`;
    if (formData.restrictions) {
      message += `*Restricoes:* ${formData.restrictions}\n`;
    }
    message += `\nCliente preencheu formulario no site e deseja cardapio personalizado!`;

    window.open(whatsappUrl(message), "_blank");

    setSubmitted(true);
    toast({
      title: "Enviado com sucesso!",
      description: "Em breve entraremos em contato pelo WhatsApp.",
    });
  };

  if (submitted) {
    return (
      <section className="section-padding bg-gradient-to-b from-emerald-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-lg mx-auto text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-6">
              <Sparkles className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-heading font-bold text-gray-900 mb-3">
              Recebemos seus dados!
            </h3>
            <p className="text-gray-500">
              Nossa equipe vai montar um cardapio personalizado para seu objetivo
              de <strong className="text-emerald-600">{formData.goal.toLowerCase()}</strong>.
              Entraremos em contato pelo WhatsApp em breve!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="lead-capture" className="section-padding bg-gradient-to-b from-emerald-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div>
              <span className="inline-block text-emerald-600 font-semibold text-sm uppercase tracking-widest mb-4">
                Cardapio personalizado
              </span>
              <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-gray-900 mb-4">
                Monte seu plano{" "}
                <span className="text-gradient">sob medida</span>
              </h2>
              <p className="text-gray-500 mb-6 leading-relaxed">
                Conte seu objetivo e restricoes alimentares. Nossa equipe vai
                criar um cardapio personalizado ideal para voce alcancar seus
                resultados.
              </p>

              <div className="space-y-4">
                {[
                  "Analise do seu perfil e objetivos",
                  "Cardapio personalizado em ate 24h",
                  "Acompanhamento via WhatsApp",
                  "Ajustes semanais conforme evolucao",
                ].map((item, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    </div>
                    <span className="text-sm text-gray-600">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-emerald-900/5 border border-emerald-100">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-gray-900">
                    Seu perfil
                  </h3>
                  <p className="text-xs text-gray-400">Preencha para receber seu cardapio</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Nome *
                  </label>
                  <Input
                    placeholder="Seu nome completo"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="rounded-xl border-gray-200 focus:border-emerald-400 focus:ring-emerald-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    WhatsApp *
                  </label>
                  <Input
                    placeholder="(61) 99999-9999"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="rounded-xl border-gray-200 focus:border-emerald-400 focus:ring-emerald-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Objetivo da dieta *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {goals.map((goal) => (
                      <button
                        key={goal}
                        type="button"
                        onClick={() => setFormData({ ...formData, goal })}
                        className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                          formData.goal === goal
                            ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25"
                            : "bg-gray-50 text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 border border-gray-100"
                        }`}
                      >
                        {goal}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Restricoes alimentares
                  </label>
                  <Input
                    placeholder="Ex: sem gluten, sem lactose, vegetariano..."
                    value={formData.restrictions}
                    onChange={(e) =>
                      setFormData({ ...formData, restrictions: e.target.value })
                    }
                    className="rounded-xl border-gray-200 focus:border-emerald-400 focus:ring-emerald-400"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/40 transition-all duration-300 hover:-translate-y-0.5 mt-2"
                >
                  Quero meu cardapio personalizado
                </Button>

                <p className="text-[11px] text-gray-400 text-center">
                  Seus dados estao seguros. Usamos apenas para contato via WhatsApp.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
