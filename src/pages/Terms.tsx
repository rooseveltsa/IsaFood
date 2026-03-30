
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { FileText, Shield, CreditCard, AlertTriangle } from "lucide-react";

const Terms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-gray-900">Termos de</span>{" "}
              <span className="bg-gradient-to-r from-green-600 to-orange-500 bg-clip-text text-transparent">
                Uso
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Leia nossos termos e condições para utilização dos serviços Isa Fitness.
              Última atualização: Janeiro de 2024.
            </p>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            
            {/* Aceitação dos Termos */}
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-full">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 ml-4">
                  1. Aceitação dos Termos
                </h2>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-700 leading-relaxed mb-4">
                  Ao utilizar os serviços da Isa Fitness, você concorda com todos os termos 
                  e condições descritos neste documento. Se você não concordar com qualquer 
                  parte destes termos, não utilize nossos serviços.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Estes termos podem ser atualizados periodicamente. É responsabilidade do 
                  usuário verificar regularmente estas condições.
                </p>
              </div>
            </div>

            {/* Serviços Oferecidos */}
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-3 rounded-full">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 ml-4">
                  2. Serviços Oferecidos
                </h2>
              </div>
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  <strong>A Isa Fitness oferece:</strong>
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Preparo e entrega de marmitas fitness personalizadas</li>
                  <li>Kits com diferentes quantidades de refeições</li>
                  <li>Atendimento nutricional básico</li>
                  <li>Consultoria alimentar via WhatsApp</li>
                  <li>Entrega em domicílio na região de Brasília-DF</li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  Reservamo-nos o direito de modificar, suspender ou descontinuar 
                  qualquer aspecto dos nossos serviços a qualquer momento.
                </p>
              </div>
            </div>

            {/* Responsabilidades do Cliente */}
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 ml-4">
                  3. Responsabilidades do Cliente
                </h2>
              </div>
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  <strong>O cliente compromete-se a:</strong>
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Fornecer informações precisas e atualizadas sobre endereço e contato</li>
                  <li>Informar corretamente sobre restrições alimentares e alergias</li>
                  <li>Estar disponível no endereço informado no horário de entrega</li>
                  <li>Verificar o estado dos produtos no momento da entrega</li>
                  <li>Armazenar adequadamente as marmitas conforme orientações fornecidas</li>
                  <li>Comunicar problemas ou reclamações em até 24 horas após a entrega</li>
                </ul>
              </div>
            </div>

            {/* Pagamentos e Preços */}
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-3 rounded-full">
                  <CreditCard className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 ml-4">
                  4. Pagamentos e Preços
                </h2>
              </div>
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Os preços são válidos por tempo limitado e podem ser alterados sem aviso prévio</li>
                  <li>O pagamento deve ser realizado no momento da confirmação do pedido</li>
                  <li>Aceitamos PIX, cartão de débito, crédito e dinheiro</li>
                  <li>Em caso de cancelamento válido, o reembolso será feito em até 7 dias úteis</li>
                  <li>Não há taxa de entrega para nossos kits</li>
                </ul>
              </div>
            </div>

            {/* Política de Cancelamento */}
            <div className="mb-12">
              <h3 className="text-xl font-bold mb-4 text-gray-900">5. Política de Cancelamento</h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li><strong>Cancelamento permitido:</strong> Até 2 horas após confirmação do pedido</li>
                  <li><strong>Após início do preparo:</strong> Cancelamento não permitido</li>
                  <li><strong>Reembolso:</strong> Valor total em até 7 dias úteis</li>
                  <li><strong>Reagendamento:</strong> Permitido com 4 horas de antecedência</li>
                </ul>
              </div>
            </div>

            {/* Limitação de Responsabilidade */}
            <div className="mb-12">
              <h3 className="text-xl font-bold mb-4 text-gray-900">6. Limitação de Responsabilidade</h3>
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <p className="text-gray-700 leading-relaxed mb-4">
                  A Isa Fitness não se responsabiliza por:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Reações alérgicas não informadas previamente pelo cliente</li>
                  <li>Deterioração dos produtos devido ao armazenamento inadequado</li>
                  <li>Atrasos na entrega causados por fatores externos (trânsito, clima, etc.)</li>
                  <li>Danos indiretos ou consequenciais decorrentes do uso dos produtos</li>
                </ul>
              </div>
            </div>

            {/* Privacidade */}
            <div className="mb-12">
              <h3 className="text-xl font-bold mb-4 text-gray-900">7. Privacidade e Dados</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <p className="text-gray-700 leading-relaxed">
                  Comprometemo-nos a proteger suas informações pessoais. Seus dados são utilizados 
                  exclusivamente para processar pedidos, melhorar nossos serviços e comunicação. 
                  Não compartilhamos informações com terceiros sem seu consentimento.
                </p>
              </div>
            </div>

            {/* Contato */}
            <div className="bg-gradient-to-r from-green-600 to-orange-500 rounded-2xl p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-4">Dúvidas sobre os Termos?</h3>
              <p className="mb-6">
                Entre em contato conosco pelo WhatsApp para esclarecimentos
              </p>
              <button 
                onClick={() => window.open('https://wa.me/5561998762527?text=Olá! Tenho dúvidas sobre os termos de uso.', '_blank')}
                className="bg-white text-green-600 font-bold px-8 py-3 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Falar no WhatsApp
              </button>
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

export default Terms;
