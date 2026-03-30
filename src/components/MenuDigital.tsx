
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { WhatsAppSimulator } from "./WhatsAppSimulator";

export const MenuDigital = () => {
  const { toast } = useToast();
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [selectedKit, setSelectedKit] = useState<any>(null);
  const [filter, setFilter] = useState("Todos");

  useEffect(() => {
    const kitData = localStorage.getItem("selectedKit");
    if (kitData) setSelectedKit(JSON.parse(kitData));
  }, []);

  const menuItems = [
    { id: 1, name: "Pure de Abobora com Frango Desfiado e Couve", category: "Low Carb", image: "/lovable-uploads/c7d79ba7-0651-4f37-871a-75518cae282a.png" },
    { id: 2, name: "Mix de Legumes com Frango Grelhado", category: "Low Carb", image: "/lovable-uploads/05bba46f-c193-44e6-82ff-f50d65654f3b.png" },
    { id: 3, name: "File de Tilapia com Legumes", category: "Low Carb", image: "/lovable-uploads/35dc68eb-8039-44f1-9507-c07bb60b5d1f.png" },
    { id: 4, name: "Carne Magra com Abobrinha Refogada", category: "Low Carb", image: "/lovable-uploads/cedfe62d-d73e-4643-b7df-40cb8750105b.png" },
    { id: 7, name: "Tilapia com Cenoura e Repolho", category: "Low Carb", image: "/lovable-uploads/35dc68eb-8039-44f1-9507-c07bb60b5d1f.png" },
    { id: 8, name: "Carne Moida com Berinjela", category: "Low Carb", image: "/lovable-uploads/cedfe62d-d73e-4643-b7df-40cb8750105b.png" },
    { id: 10, name: "Salada Proteica com Frango", category: "Low Carb", image: "/lovable-uploads/05bba46f-c193-44e6-82ff-f50d65654f3b.png" },
    { id: 11, name: "Escondidinho de Carne com Batata Doce", category: "Fit", image: "/lovable-uploads/35dc68eb-8039-44f1-9507-c07bb60b5d1f.png" },
    { id: 13, name: "Arroz Integral com Frango e Legumes", category: "Fit", image: "/lovable-uploads/c7d79ba7-0651-4f37-871a-75518cae282a.png" },
    { id: 14, name: "Sobrecoxa Assada com Arroz e Legumes", category: "Fit", image: "/lovable-uploads/05bba46f-c193-44e6-82ff-f50d65654f3b.png" },
    { id: 15, name: "Pure de Batata Doce com Carne Moida e Couve", category: "Fit", image: "/lovable-uploads/35dc68eb-8039-44f1-9507-c07bb60b5d1f.png" },
    { id: 16, name: "Macarrao Integral com Almondegas Fit", category: "Fit", image: "/lovable-uploads/cedfe62d-d73e-4643-b7df-40cb8750105b.png" },
    { id: 17, name: "Carreteiro Fit de Carne Magra", category: "Fit", image: "/lovable-uploads/c7d79ba7-0651-4f37-871a-75518cae282a.png" },
    { id: 18, name: "Strogonofe de Frango Fit", category: "Fit", image: "/lovable-uploads/05bba46f-c193-44e6-82ff-f50d65654f3b.png" },
    { id: 19, name: "Frango Grelhado com Batata Doce", category: "Fit", image: "/lovable-uploads/35dc68eb-8039-44f1-9507-c07bb60b5d1f.png" },
    { id: 20, name: "Frango Xadrez com Arroz Integral", category: "Fit", image: "/lovable-uploads/cedfe62d-d73e-4643-b7df-40cb8750105b.png" },
  ];

  const filtered = filter === "Todos" ? menuItems : menuItems.filter((i) => i.category === filter);
  const totalItems = Object.values(cart).reduce((sum, c) => sum + c, 0);

  const addToCart = (id: number) => {
    if (selectedKit && totalItems >= selectedKit.marmitas) {
      toast({ title: "Limite do kit atingido", description: `${selectedKit.name} tem ${selectedKit.marmitas} marmitas.`, variant: "destructive" });
      return;
    }
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));

    // Save to localStorage
    const updatedCart = { ...cart, [id]: (cart[id] || 0) + 1 };
    const items = menuItems.filter((item) => updatedCart[item.id] && updatedCart[item.id] > 0);
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    const order = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      items: items.map((item) => ({ id: item.id, name: item.name, category: item.category, quantity: updatedCart[item.id] })),
      status: "carrinho",
      customerInfo: null,
      total: Object.values(updatedCart).reduce((s: number, c: number) => s + c, 0),
    };
    const idx = orders.findIndex((o: any) => o.status === "carrinho" && !o.customerInfo);
    if (idx >= 0) orders[idx] = order; else orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => {
      const next = { ...prev };
      if (next[id] > 1) next[id]--; else delete next[id];
      return next;
    });
  };

  const handleFinalize = () => {
    if (totalItems === 0) {
      toast({ title: "Carrinho vazio", description: "Adicione marmitas ao pedido.", variant: "destructive" });
      return;
    }
    if (selectedKit && totalItems !== selectedKit.marmitas) {
      toast({ title: "Quantidade incorreta", description: `Selecione exatamente ${selectedKit.marmitas} marmitas.`, variant: "destructive" });
      return;
    }
    setShowWhatsApp(true);
  };

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Kit bar */}
        {selectedKit && (
          <div className="flex items-center justify-between bg-gray-50 rounded-xl px-5 py-4 mb-8 max-w-4xl mx-auto">
            <div>
              <p className="font-heading font-bold text-gray-900 text-sm">{selectedKit.name}</p>
              <p className="text-xs text-gray-500">Selecione {selectedKit.marmitas} marmitas</p>
            </div>
            <div className="text-right">
              <span className="text-lg font-heading font-bold text-gray-900">
                {totalItems}/{selectedKit.marmitas}
              </span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="max-w-4xl mx-auto mb-8">
          <p className="text-emerald-600 text-sm font-semibold uppercase tracking-wider mb-3">
            Cardapio
          </p>
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-gray-900 mb-2">
            Escolha suas marmitas
          </h2>
          <p className="text-gray-500 text-sm">
            Todas com 300-340g e 120g de proteina. Sem conservantes.
          </p>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-8 max-w-4xl mx-auto">
          {["Todos", "Low Carb", "Fit"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === cat
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 max-w-4xl mx-auto">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`rounded-xl overflow-hidden transition-all ${
                cart[item.id]
                  ? "ring-2 ring-gray-900"
                  : "border border-gray-100"
              }`}
            >
              <div className="relative aspect-square">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                {cart[item.id] && (
                  <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center">
                    {cart[item.id]}
                  </div>
                )}
                <div className="absolute top-2 left-2">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    item.category === "Low Carb"
                      ? "bg-emerald-600 text-white"
                      : "bg-amber-500 text-white"
                  }`}>
                    {item.category}
                  </span>
                </div>
              </div>

              <div className="p-3">
                <p className="text-xs font-medium text-gray-900 leading-snug mb-3 line-clamp-2 min-h-[2.5rem]">
                  {item.name}
                </p>

                {cart[item.id] ? (
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                    >
                      <Minus className="h-3.5 w-3.5 text-gray-600" />
                    </button>
                    <span className="text-sm font-bold text-gray-900">{cart[item.id]}</span>
                    <button
                      onClick={() => addToCart(item.id)}
                      className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center hover:bg-gray-800"
                    >
                      <Plus className="h-3.5 w-3.5 text-white" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => addToCart(item.id)}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 rounded-lg text-xs transition-colors"
                  >
                    Adicionar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Floating cart */}
        {totalItems > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
            <Button
              onClick={handleFinalize}
              className="bg-gray-900 hover:bg-gray-800 text-white font-bold px-6 py-4 rounded-2xl shadow-2xl shadow-gray-900/20 text-sm"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Finalizar ({totalItems} {totalItems > 1 ? "itens" : "item"})
            </Button>
          </div>
        )}

        {showWhatsApp && (
          <WhatsAppSimulator
            cart={cart}
            menuItems={menuItems}
            onClose={() => { setShowWhatsApp(false); setCart({}); }}
          />
        )}
      </div>
    </section>
  );
};
