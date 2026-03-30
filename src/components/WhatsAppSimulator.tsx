
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { MessageCircle, ArrowLeft, Send, Phone, Video, MoreVertical } from "lucide-react";
import { BUSINESS } from "@/lib/constants";

interface WhatsAppSimulatorProps {
  cart: {[key: string]: number};
  menuItems: any[];
  onClose: () => void;
}

export const WhatsAppSimulator = ({ cart, menuItems, onClose }: WhatsAppSimulatorProps) => {
  const [step, setStep] = useState(1);
  const [currentInput, setCurrentInput] = useState("");
  const [customerData, setCustomerData] = useState({
    name: "",
    address: "",
    phone: ""
  });
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Ola! Vi que voce escolheu algumas marmitas. Para finalizar, qual e o seu nome?",
      isBot: true,
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedItems = menuItems.filter(item => cart[item.id]);
  const totalItems = Object.values(cart).reduce((sum, count) => sum + count, 0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [step]);

  const addMessage = (text: string, isBot: boolean = false) => {
    const newMessage = {
      id: messages.length + 1,
      text,
      isBot,
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = () => {
    if (!currentInput.trim()) return;

    const input = currentInput.trim();
    addMessage(input);
    setCurrentInput("");

    setTimeout(() => {
      if (step === 1) {
        setCustomerData(prev => ({...prev, name: input}));
        addMessage(`Prazer, ${input}! Agora preciso do seu endereco para entrega.`, true);
        setStep(2);
      } else if (step === 2) {
        setCustomerData(prev => ({...prev, address: input}));
        addMessage("Perfeito! Qual e o seu telefone?", true);
        setStep(3);
      } else if (step === 3) {
        const updatedCustomerData = {...customerData, phone: input};
        setCustomerData(updatedCustomerData);
        addMessage("Excelente! Transferindo para nosso WhatsApp oficial...", true);
        setStep(4);

        setTimeout(() => {
          handleFinalizeOrder(updatedCustomerData);
        }, 2000);
      }
    }, 1000);
  };

  const handleFinalizeOrder = (finalCustomerData: typeof customerData) => {
    const currentOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const orderIndex = currentOrders.findIndex((order: any) =>
      order.status === 'carrinho' && !order.customerInfo
    );

    if (orderIndex >= 0) {
      currentOrders[orderIndex].customerInfo = finalCustomerData;
      currentOrders[orderIndex].status = 'whatsapp_enviado';
      currentOrders[orderIndex].whatsappSentAt = new Date().toISOString();
      localStorage.setItem('orders', JSON.stringify(currentOrders));
    }

    const selectedKit = JSON.parse(localStorage.getItem('selectedKit') || '{}');

    let kitPrice = "0,00";
    if (selectedKit.name === "Kit 10") {
      kitPrice = "169,00";
    } else if (selectedKit.name === "Kit 20") {
      kitPrice = "299,00";
    } else if (selectedKit.name === "Kit 40") {
      kitPrice = "449,00";
    }

    let message = `*PEDIDO ISA FITNESS*\n\n`;
    message += `*Cliente:* ${finalCustomerData.name}\n`;
    message += `*Telefone:* ${finalCustomerData.phone}\n`;
    message += `*Endereco:* ${finalCustomerData.address}\n\n`;
    message += `*ITENS DO PEDIDO:*\n`;

    selectedItems.forEach(item => {
      message += `${cart[item.id]}x ${item.name}\n`;
    });

    message += `\n*Kit:* ${selectedKit.name || 'Kit nao identificado'}\n`;
    message += `*Quantidade:* ${totalItems} marmitas\n`;
    message += `*Total:* R$ ${kitPrice}\n\n`;
    message += `*Pix:* ${BUSINESS.pix}`;

    const whatsappUrl = `https://wa.me/${BUSINESS.whatsapp.number}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md h-[600px] bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col">

        {/* Header estilo WhatsApp */}
        <div className="bg-[#075e54] text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button onClick={onClose} className="text-white hover:bg-[#128c7e] p-1 rounded">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="w-10 h-10 bg-emerald-400/20 rounded-full flex items-center justify-center">
              <MessageCircle className="h-5 w-5 text-emerald-200" />
            </div>
            <div>
              <h3 className="font-semibold">{BUSINESS.name}</h3>
              <p className="text-xs text-green-200">online</p>
            </div>
          </div>
          <div className="flex space-x-4">
            <Phone className="h-5 w-5" />
            <Video className="h-5 w-5" />
            <MoreVertical className="h-5 w-5" />
          </div>
        </div>

        {/* Resumo do pedido */}
        <div className="bg-emerald-50 px-4 py-2 border-b text-xs text-emerald-700">
          <strong>Pedido:</strong> {selectedItems.map(item => `${cart[item.id]}x ${item.name}`).join(', ')}
          <span className="font-semibold"> (Total: {totalItems})</span>
        </div>

        {/* Chat area */}
        <div
          className="flex-1 overflow-y-auto px-4 py-2 space-y-2"
          style={{ backgroundColor: '#e5ddd5' }}
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isBot ? 'justify-start' : 'justify-end'} mb-2`}
            >
              <div
                className={`max-w-[75%] p-3 rounded-2xl ${
                  message.isBot
                    ? 'bg-white text-gray-900 shadow-sm rounded-tl-sm'
                    : 'bg-[#dcf8c6] text-gray-900 rounded-tr-sm'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <div className="flex items-center justify-end space-x-1 mt-1">
                  <span className="text-[10px] text-gray-500">{message.time}</span>
                  {!message.isBot && (
                    <svg viewBox="0 0 16 15" width="16" height="15">
                      <path fill="#4fc3f7" d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.063-.51z"/>
                      <path fill="#4fc3f7" d="M12.23 3.316l-.478-.372a.365.365 0 0 0-.51.063L6.886 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.063-.51z"/>
                    </svg>
                  )}
                </div>
              </div>
            </div>
          ))}

          {step === 4 && (
            <div className="flex justify-start mb-2">
              <div className="bg-white p-3 rounded-2xl rounded-tl-sm shadow-sm">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin h-4 w-4 border-2 border-[#075e54] border-t-transparent rounded-full"></div>
                  <span className="text-sm text-gray-600">Conectando...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        {step <= 3 && (
          <div className="bg-[#f0f0f0] px-4 py-3 flex items-center space-x-2">
            <div className="flex-1 bg-white rounded-full px-4 py-2 flex items-center">
              <Input
                ref={inputRef}
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                placeholder={
                  step === 1 ? "Digite seu nome..." :
                  step === 2 ? "Digite seu endereco completo..." :
                  "Digite seu telefone..."
                }
                className="border-0 bg-transparent focus:outline-none focus:ring-0 p-0"
                onKeyPress={handleKeyPress}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!currentInput.trim()}
              className="w-12 h-12 bg-[#075e54] hover:bg-[#128c7e] disabled:bg-gray-400 rounded-full flex items-center justify-center transition-colors"
            >
              <Send className="h-5 w-5 text-white ml-0.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
