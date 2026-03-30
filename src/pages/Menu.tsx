
import { MenuDigital } from "@/components/MenuDigital";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Leaf } from "lucide-react";

const Menu = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
      {/* Simple Header for Menu Page */}
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center space-x-2">
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-2 rounded-full">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-orange-500 bg-clip-text text-transparent">
              Isa Fitness
            </span>
          </div>
          <p className="text-center text-gray-600 mt-2">Cardápio Digital - Marmitas Saudáveis</p>
        </div>
      </header>
      
      <MenuDigital />
      <WhatsAppButton />
    </div>
  );
};

export default Menu;
