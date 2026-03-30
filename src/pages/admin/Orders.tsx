import { useState, useMemo } from "react";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { OrderCard, type OrderSummary } from "@/components/admin/orders/OrderCard";
import { OrderDetail, type OrderFull } from "@/components/admin/orders/OrderDetail";
import { OrderForm } from "@/components/admin/orders/OrderForm";
import type { OrderStatus } from "@/components/admin/orders/OrderStatusBadge";

// ---------------------------------------------------------------------------
// TODO: Replace mock data with Supabase queries via @tanstack/react-query.
// Example:
//   const { data: orders } = useQuery({
//     queryKey: ["admin", "orders", statusFilter, searchTerm],
//     queryFn: () => fetchOrders({ status: statusFilter, search: searchTerm }),
//   });
// ---------------------------------------------------------------------------

// -- Mock data ---------------------------------------------------------------

const now = new Date();

const mockOrders: OrderFull[] = [
  {
    id: "ord-001",
    orderNumber: 1042,
    customerName: "Maria Silva",
    customerPhone: "(11) 98765-4321",
    kitName: "Kit Fit Premium",
    total: 149.7,
    status: "novo",
    itemsCount: 3,
    createdAt: new Date(now.getTime() - 5 * 60000).toISOString(),
    deliveryAddress: "Rua das Flores, 123 - Vila Mariana, SP",
    paymentMethod: "Cartao de Credito",
    notes: "Sem pimenta, por favor.",
    items: [
      { id: "i1", name: "Frango grelhado com legumes", quantity: 2, unitPrice: 29.9 },
      { id: "i2", name: "Strogonoff fit", quantity: 1, unitPrice: 34.9 },
      { id: "i3", name: "Suco verde detox", quantity: 3, unitPrice: 8.5 },
    ],
    statusHistory: [
      { status: "novo", timestamp: new Date(now.getTime() - 5 * 60000).toISOString() },
    ],
  },
  {
    id: "ord-002",
    orderNumber: 1041,
    customerName: "Joao Oliveira",
    customerPhone: "(11) 91234-5678",
    kitName: "Kit Low Carb",
    total: 79.8,
    status: "confirmado",
    itemsCount: 2,
    createdAt: new Date(now.getTime() - 22 * 60000).toISOString(),
    deliveryAddress: "Av. Paulista, 900 - Bela Vista, SP",
    paymentMethod: "PIX",
    notes: "",
    items: [
      { id: "i4", name: "Salmao grelhado", quantity: 1, unitPrice: 44.9 },
      { id: "i5", name: "Salada proteica", quantity: 1, unitPrice: 34.9 },
    ],
    statusHistory: [
      { status: "novo", timestamp: new Date(now.getTime() - 30 * 60000).toISOString() },
      { status: "confirmado", timestamp: new Date(now.getTime() - 22 * 60000).toISOString() },
    ],
  },
  {
    id: "ord-003",
    orderNumber: 1040,
    customerName: "Ana Costa",
    customerPhone: "(11) 97777-8888",
    kitName: "Kit Fit Basico",
    total: 119.6,
    status: "em_producao",
    itemsCount: 4,
    createdAt: new Date(now.getTime() - 45 * 60000).toISOString(),
    deliveryAddress: "Rua Augusta, 456 - Consolacao, SP",
    paymentMethod: "Cartao de Debito",
    notes: "Entregar depois das 18h.",
    items: [
      { id: "i6", name: "Frango grelhado com legumes", quantity: 2, unitPrice: 29.9 },
      { id: "i7", name: "Arroz integral", quantity: 2, unitPrice: 9.9 },
      { id: "i8", name: "Suco verde detox", quantity: 2, unitPrice: 8.5 },
    ],
    statusHistory: [
      { status: "novo", timestamp: new Date(now.getTime() - 60 * 60000).toISOString() },
      { status: "confirmado", timestamp: new Date(now.getTime() - 50 * 60000).toISOString() },
      { status: "em_producao", timestamp: new Date(now.getTime() - 45 * 60000).toISOString() },
    ],
  },
  {
    id: "ord-004",
    orderNumber: 1039,
    customerName: "Carlos Souza",
    customerPhone: "(11) 96666-5555",
    kitName: "Kit Proteico",
    total: 54.9,
    status: "pronto",
    itemsCount: 1,
    createdAt: new Date(now.getTime() - 90 * 60000).toISOString(),
    deliveryAddress: "Rua Oscar Freire, 789 - Pinheiros, SP",
    paymentMethod: "PIX",
    notes: "",
    items: [
      { id: "i9", name: "Bowl proteico completo", quantity: 1, unitPrice: 54.9 },
    ],
    statusHistory: [
      { status: "novo", timestamp: new Date(now.getTime() - 120 * 60000).toISOString() },
      { status: "confirmado", timestamp: new Date(now.getTime() - 110 * 60000).toISOString() },
      { status: "em_producao", timestamp: new Date(now.getTime() - 100 * 60000).toISOString() },
      { status: "pronto", timestamp: new Date(now.getTime() - 90 * 60000).toISOString() },
    ],
  },
  {
    id: "ord-005",
    orderNumber: 1038,
    customerName: "Fernanda Lima",
    customerPhone: "(11) 94444-3333",
    kitName: "Kit Vegano",
    total: 134.7,
    status: "entregue",
    itemsCount: 3,
    createdAt: new Date(now.getTime() - 180 * 60000).toISOString(),
    deliveryAddress: "Rua Harmonia, 321 - Vila Madalena, SP",
    paymentMethod: "Cartao de Credito",
    notes: "Cliente VIP - entregar com cuidado.",
    items: [
      { id: "i10", name: "Bowl vegano thai", quantity: 1, unitPrice: 44.9 },
      { id: "i11", name: "Wrap de grão de bico", quantity: 2, unitPrice: 34.9 },
      { id: "i12", name: "Smoothie verde", quantity: 2, unitPrice: 10.0 },
    ],
    statusHistory: [
      { status: "novo", timestamp: new Date(now.getTime() - 240 * 60000).toISOString() },
      { status: "confirmado", timestamp: new Date(now.getTime() - 220 * 60000).toISOString() },
      { status: "em_producao", timestamp: new Date(now.getTime() - 210 * 60000).toISOString() },
      { status: "pronto", timestamp: new Date(now.getTime() - 195 * 60000).toISOString() },
      { status: "entregue", timestamp: new Date(now.getTime() - 180 * 60000).toISOString() },
    ],
  },
  {
    id: "ord-006",
    orderNumber: 1037,
    customerName: "Roberto Mendes",
    customerPhone: "(11) 93333-2222",
    kitName: "Kit Fit Premium",
    total: 99.8,
    status: "em_producao",
    itemsCount: 2,
    createdAt: new Date(now.getTime() - 35 * 60000).toISOString(),
    deliveryAddress: "Al. Santos, 1500 - Cerqueira Cesar, SP",
    paymentMethod: "PIX",
    notes: "Trocar arroz por batata doce.",
    items: [
      { id: "i13", name: "Strogonoff fit", quantity: 2, unitPrice: 34.9 },
      { id: "i14", name: "Suco verde detox", quantity: 2, unitPrice: 8.5 },
    ],
    statusHistory: [
      { status: "novo", timestamp: new Date(now.getTime() - 50 * 60000).toISOString() },
      { status: "confirmado", timestamp: new Date(now.getTime() - 42 * 60000).toISOString() },
      { status: "em_producao", timestamp: new Date(now.getTime() - 35 * 60000).toISOString() },
    ],
  },
  {
    id: "ord-007",
    orderNumber: 1036,
    customerName: "Lucia Pereira",
    customerPhone: "(11) 92222-1111",
    kitName: "Kit Fit Basico",
    total: 89.7,
    status: "novo",
    itemsCount: 3,
    createdAt: new Date(now.getTime() - 8 * 60000).toISOString(),
    deliveryAddress: "Rua Haddock Lobo, 200 - Jardins, SP",
    paymentMethod: "Cartao de Credito",
    notes: "",
    items: [
      { id: "i15", name: "Frango grelhado com legumes", quantity: 3, unitPrice: 29.9 },
    ],
    statusHistory: [
      { status: "novo", timestamp: new Date(now.getTime() - 8 * 60000).toISOString() },
    ],
  },
  {
    id: "ord-008",
    orderNumber: 1035,
    customerName: "Paulo Henrique",
    customerPhone: "(11) 91111-0000",
    kitName: "Kit Low Carb",
    total: 179.4,
    status: "confirmado",
    itemsCount: 6,
    createdAt: new Date(now.getTime() - 60 * 60000).toISOString(),
    deliveryAddress: "Rua Bela Cintra, 888 - Consolacao, SP",
    paymentMethod: "PIX",
    notes: "Pedido para a semana toda.",
    items: [
      { id: "i16", name: "Frango grelhado com legumes", quantity: 3, unitPrice: 29.9 },
      { id: "i17", name: "Salmao grelhado", quantity: 2, unitPrice: 44.9 },
      { id: "i18", name: "Salada proteica", quantity: 1, unitPrice: 34.9 },
    ],
    statusHistory: [
      { status: "novo", timestamp: new Date(now.getTime() - 75 * 60000).toISOString() },
      { status: "confirmado", timestamp: new Date(now.getTime() - 60 * 60000).toISOString() },
    ],
  },
  {
    id: "ord-009",
    orderNumber: 1034,
    customerName: "Camila Rocha",
    customerPhone: "(11) 90000-9999",
    kitName: "Kit Vegano",
    total: 44.9,
    status: "pronto",
    itemsCount: 1,
    createdAt: new Date(now.getTime() - 120 * 60000).toISOString(),
    deliveryAddress: "Rua Cardeal Arcoverde, 150 - Pinheiros, SP",
    paymentMethod: "Cartao de Debito",
    notes: "",
    items: [
      { id: "i19", name: "Bowl vegano thai", quantity: 1, unitPrice: 44.9 },
    ],
    statusHistory: [
      { status: "novo", timestamp: new Date(now.getTime() - 150 * 60000).toISOString() },
      { status: "confirmado", timestamp: new Date(now.getTime() - 140 * 60000).toISOString() },
      { status: "em_producao", timestamp: new Date(now.getTime() - 130 * 60000).toISOString() },
      { status: "pronto", timestamp: new Date(now.getTime() - 120 * 60000).toISOString() },
    ],
  },
  {
    id: "ord-010",
    orderNumber: 1033,
    customerName: "Diego Almeida",
    customerPhone: "(11) 98888-7777",
    kitName: "Kit Proteico",
    total: 164.7,
    status: "entregue",
    itemsCount: 3,
    createdAt: new Date(now.getTime() - 300 * 60000).toISOString(),
    deliveryAddress: "Av. Reboucas, 600 - Pinheiros, SP",
    paymentMethod: "Cartao de Credito",
    notes: "",
    items: [
      { id: "i20", name: "Bowl proteico completo", quantity: 3, unitPrice: 54.9 },
    ],
    statusHistory: [
      { status: "novo", timestamp: new Date(now.getTime() - 360 * 60000).toISOString() },
      { status: "confirmado", timestamp: new Date(now.getTime() - 350 * 60000).toISOString() },
      { status: "em_producao", timestamp: new Date(now.getTime() - 340 * 60000).toISOString() },
      { status: "pronto", timestamp: new Date(now.getTime() - 320 * 60000).toISOString() },
      { status: "entregue", timestamp: new Date(now.getTime() - 300 * 60000).toISOString() },
    ],
  },
];

// -- Filter tabs config -------------------------------------------------------

type FilterKey = "todos" | OrderStatus;

const filterTabs: { key: FilterKey; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "novo", label: "Novo" },
  { key: "confirmado", label: "Confirmado" },
  { key: "em_producao", label: "Em Producao" },
  { key: "pronto", label: "Pronto" },
  { key: "entregue", label: "Entregue" },
];

// ---------------------------------------------------------------------------
// Orders page
// ---------------------------------------------------------------------------

export default function Orders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterKey>("todos");
  const [selectedOrder, setSelectedOrder] = useState<OrderFull | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Filter and search logic
  const filteredOrders = useMemo(() => {
    let result = [...mockOrders];

    // Filter by status
    if (activeFilter !== "todos") {
      result = result.filter((o) => o.status === activeFilter);
    }

    // Filter by search term (customer name or order number)
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(
        (o) =>
          o.customerName.toLowerCase().includes(term) ||
          o.orderNumber.toString().includes(term) ||
          o.kitName.toLowerCase().includes(term),
      );
    }

    // Sort by most recent
    result.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    return result;
  }, [searchTerm, activeFilter]);

  // Derive summary for list display
  const orderSummaries: OrderSummary[] = filteredOrders.map((o) => ({
    id: o.id,
    orderNumber: o.orderNumber,
    customerName: o.customerName,
    kitName: o.kitName,
    total: o.total,
    status: o.status,
    itemsCount: o.itemsCount,
    createdAt: o.createdAt,
  }));

  const handleCardClick = (summary: OrderSummary) => {
    const full = mockOrders.find((o) => o.id === summary.id) ?? null;
    setSelectedOrder(full);
    setIsDetailOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/60 via-white to-emerald-50/40">
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        {/* Header */}
        <div className="mb-5">
          <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
            Pedidos
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie todos os pedidos do seu negocio
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, numero ou kit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-11 pl-10 rounded-xl bg-white"
          />
        </div>

        {/* Status filter pills — horizontal scroll on mobile */}
        <div className="flex gap-2 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-hide mb-4">
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveFilter(tab.key)}
                className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Order list */}
        <div className="space-y-3 pb-24">
          {orderSummaries.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onClick={handleCardClick}
            />
          ))}

          {orderSummaries.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-sm">
                Nenhum pedido encontrado.
              </p>
            </div>
          )}
        </div>

        {/* Floating add button */}
        <button
          type="button"
          onClick={() => setIsFormOpen(true)}
          className="fixed bottom-24 right-4 lg:bottom-8 lg:right-8 z-40 flex items-center justify-center h-14 w-14 rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 active:scale-95 transition-all"
          aria-label="Criar novo pedido"
        >
          <Plus className="h-6 w-6" />
        </button>

        {/* Order detail drawer */}
        <OrderDetail
          order={selectedOrder}
          open={isDetailOpen}
          onClose={() => {
            setIsDetailOpen(false);
            setSelectedOrder(null);
          }}
        />

        {/* New order form drawer */}
        <OrderForm
          open={isFormOpen}
          onClose={() => setIsFormOpen(false)}
        />
      </div>
    </div>
  );
}
