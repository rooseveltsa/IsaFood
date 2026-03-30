
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Clock, MapPin, Package, Shield, AlertCircle, CheckCircle } from "lucide-react";

const DeliveryPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-gray-900">Política de</span>{" "}
              <span className="bg-gradient-to-r from-green-600 to-orange-500 bg-clip-text text-transparent">
                Entrega
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Conheça todos os detalhes sobre nossas entregas, prazos, 
              áreas de atendimento e políticas de qualidade.
            </p>
          </div>
        </div>
      </section>

      {/* Delivery Information */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            
            {/* Prazos e Horários */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-full">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 ml-4">
                  Prazos e Horários
                </h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">Entrega padrão: até 24 horas</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">Pedidos até 14h: entrega no mesmo dia</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">Horário de entrega: 8h às 20h</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">Entregas de segunda a sábado</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-blue-800 font-medium">Entrega Express</p>
                    <p className="text-blue-700 text-sm">Kit Fitness Pro e Kit Atleta têm prioridade na entrega</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Área de Atendimento */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-3 rounded-full">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 ml-4">
                  Área de Atendimento
                </h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Brasília - DF</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Plano Piloto (Asa Norte e Sul)</li>
                    <li>• Águas Claras</li>
                    <li>• Taguatinga</li>
                    <li>• Ceilândia</li>
                    <li>• Guará</li>
                    <li>• Sobradinho</li>
                    <li>• Planaltina</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-green-800 font-medium">Entrega Gratuita</p>
                    <p className="text-green-700 text-sm">Para todos os kits, em toda região de atendimento</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Qualidade e Conservação */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">
              Qualidade e <span className="text-green-600">Conservação</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Package className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Embalagem</h3>
              <p className="text-gray-600">
                Utilizamos embalagens térmicas especiais que mantêm a temperatura 
                ideal durante todo o transporte.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Higiene</h3>
              <p className="text-gray-600">
                Seguimos rigorosos protocolos de higiene e segurança alimentar 
                em todas as etapas do processo.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Frescor</h3>
              <p className="text-gray-600">
                Todas as marmitas são preparadas no dia da entrega ou no dia anterior, 
                garantindo máximo frescor.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Políticas Importantes */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center text-gray-900">
              Políticas <span className="text-green-600">Importantes</span>
            </h2>

            <div className="space-y-8">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-bold mb-4 text-gray-900">Cancelamentos</h3>
                <p className="text-gray-700 mb-3">
                  Cancelamentos podem ser feitos até 2 horas após a confirmação do pedido. 
                  Após esse prazo, como já iniciamos o preparo, não é possível cancelar.
                </p>
                <p className="text-sm text-gray-600">
                  Para cancelar, entre em contato via WhatsApp: (61) 99876-2527
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-bold mb-4 text-gray-900">Problemas na Entrega</h3>
                <p className="text-gray-700 mb-3">
                  Se houver algum problema com sua entrega (atraso, temperatura inadequada, etc.), 
                  entre em contato imediatamente. Oferecemos reposição gratuita ou reembolso total.
                </p>
                <p className="text-sm text-gray-600">
                  Nosso compromisso é com sua satisfação total.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-bold mb-4 text-gray-900">Reagendamento</h3>
                <p className="text-gray-700 mb-3">
                  É possível reagendar sua entrega com até 4 horas de antecedência. 
                  Basta entrar em contato via WhatsApp informando a nova data/horário desejado.
                </p>
                <p className="text-sm text-gray-600">
                  Sujeito à disponibilidade da agenda de entregas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
      <BackToTop />
    </div>
  );
};

export default DeliveryPolicy;
