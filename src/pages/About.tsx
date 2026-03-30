
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Leaf, Heart, Award, Users, Target, Clock } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-gray-900">Sobre a</span>{" "}
              <span className="bg-gradient-to-r from-green-600 to-orange-500 bg-clip-text text-transparent">
                Isa Fitness
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transformamos vidas através da alimentação saudável e equilibrada, 
              oferecendo marmitas fitness preparadas com muito carinho e os melhores ingredientes.
            </p>
          </div>
        </div>
      </section>

      {/* Nossa História */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-900">
                Nossa <span className="text-green-600">História</span>
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                A Isa Fitness nasceu da paixão por uma vida mais saudável e da necessidade 
                de oferecer alimentação de qualidade para pessoas que buscam praticidade 
                sem abrir mão do sabor e da nutrição.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Com anos de experiência em nutrição e culinária, nossa fundadora Isa 
                desenvolveu receitas únicas que combinam sabor, saúde e praticidade, 
                atendendo diferentes objetivos e restrições alimentares.
              </p>
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-full">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <span className="text-gray-700 font-medium">
                  Feito com amor para sua saúde
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img 
                src="/lovable-uploads/c7d79ba7-0651-4f37-871a-75518cae282a.png" 
                alt="Marmitas preparadas com carinho"
                className="w-full h-48 object-cover rounded-lg shadow-lg"
              />
              <img 
                src="/lovable-uploads/05bba46f-c193-44e6-82ff-f50d65654f3b.png" 
                alt="Ingredientes frescos"
                className="w-full h-48 object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Nossos Valores */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">
              Nossos <span className="text-green-600">Valores</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Princípios que guiam nosso trabalho diário
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Leaf className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Qualidade</h3>
              <p className="text-gray-600">
                Selecionamos apenas os melhores ingredientes frescos e naturais 
                para garantir máxima qualidade nutricional.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Excelência</h3>
              <p className="text-gray-600">
                Buscamos sempre superar expectativas, desde o preparo até a entrega, 
                mantendo os mais altos padrões.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Cuidado</h3>
              <p className="text-gray-600">
                Cada cliente é único. Personalizamos nossos serviços para atender 
                necessidades e objetivos individuais.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Estatísticas */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-orange-500">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-green-100">Clientes Satisfeitos</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10k+</div>
              <div className="text-green-100">Marmitas Entregues</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">3</div>
              <div className="text-green-100">Anos de Experiência</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24h</div>
              <div className="text-green-100">Tempo de Entrega</div>
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

export default About;
