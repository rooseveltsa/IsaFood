
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { CheckCircle, Clock, Truck, ShoppingCart, MessageSquare, Package } from "lucide-react";

const HowItWorksPage = () => {
  const steps = [
    {
      icon: <ShoppingCart className="h-12 w-12 text-green-500" />,
      title: "1. Escolha seu Kit",
      description: "Navegue por nossos 3 kits disponíveis e selecione o que melhor se adequa aos seus objetivos. Cada kit tem quantidades diferentes de marmitas.",
      details: [
        "Kit Iniciante: 5 marmitas - R$ 89,00",
        "Kit Fitness Pro: 10 marmitas - R$ 149,00", 
        "Kit Atleta: 15 marmitas - R$ 219,00"
      ]
    },
    {
      icon: <MessageSquare className="h-12 w-12 text-orange-500" />,
      title: "2. Personalize via WhatsApp",
      description: "Após escolher seu kit, você será direcionado para nosso WhatsApp onde poderá personalizar completamente seu pedido.",
      details: [
        "Informe restrições alimentares",
        "Escolha suas proteínas favoritas",
        "Defina o endereço de entrega",
        "Confirme data e horário preferido"
      ]
    },
    {
      icon: <Package className="h-12 w-12 text-blue-500" />,
      title: "3. Preparação Cuidadosa",
      description: "Nossa equipe prepara suas marmitas com ingredientes frescos e seguindo rigorosos padrões de qualidade e higiene.",
      details: [
        "Ingredientes selecionados diariamente",
        "Preparo sem conservantes artificiais",
        "Embalagens adequadas para conservação",
        "Controle de qualidade em cada etapa"
      ]
    },
    {
      icon: <Truck className="h-12 w-12 text-purple-500" />,
      title: "4. Entrega Rápida",
      description: "Suas marmitas chegam fresquinhas em até 24 horas, prontas para consumo ou congelamento.",
      details: [
        "Entrega em até 24 horas",
        "Pedidos até 14h podem sair no mesmo dia",
        "Embalagens térmicas para conservação",
        "Rastreamento via WhatsApp"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-gray-900">Como</span>{" "}
              <span className="bg-gradient-to-r from-green-600 to-orange-500 bg-clip-text text-transparent">
                Funciona
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Processo simples e transparente em 4 passos para você receber 
              suas marmitas fitness com a máxima qualidade e praticidade.
            </p>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="space-y-16">
            {steps.map((step, index) => (
              <div key={index} className={`grid md:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'md:grid-flow-col-dense' : ''}`}>
                <div className={index % 2 === 1 ? 'md:col-start-2' : ''}>
                  <div className="flex items-center mb-6">
                    <div className="flex-shrink-0">
                      {step.icon}
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 ml-4">
                      {step.title}
                    </h2>
                  </div>
                  <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                    {step.description}
                  </p>
                  <ul className="space-y-3">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={index % 2 === 1 ? 'md:col-start-1' : ''}>
                  <div className="bg-gradient-to-br from-green-100 to-orange-100 rounded-2xl p-8 text-center">
                    <div className="text-6xl font-bold text-gray-300 mb-4">
                      {index + 1}
                    </div>
                    <img 
                      src="/lovable-uploads/c7d79ba7-0651-4f37-871a-75518cae282a.png" 
                      alt={`Passo ${index + 1}`}
                      className="w-full h-48 object-cover rounded-xl shadow-lg"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-orange-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Pronto para começar sua jornada fitness?
          </h2>
          <p className="text-green-100 text-xl mb-8 max-w-2xl mx-auto">
            Escolha seu kit ideal e receba marmitas deliciosas e nutritivas em casa!
          </p>
          <button 
            onClick={() => window.location.href = '/#kits'}
            className="bg-white text-green-600 font-bold px-8 py-3 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            Ver Nossos Kits
          </button>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
      <BackToTop />
    </div>
  );
};

export default HowItWorksPage;
