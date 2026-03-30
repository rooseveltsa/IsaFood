import { useState, useCallback } from "react";
import { KanbanBoard } from "@/components/admin/kanban/KanbanBoard";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type OrderStatus =
  | "novo"
  | "confirmado"
  | "em_producao"
  | "pronto"
  | "entregue";

export interface KanbanOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  itemsCount: number;
  kitName?: string;
  total: number;
  status: OrderStatus;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const now = new Date();

const initialOrders: KanbanOrder[] = [
  {
    id: "k-001",
    orderNumber: "1042",
    customerName: "Maria Silva",
    itemsCount: 3,
    kitName: "Kit Fit Semanal",
    total: 89.7,
    status: "novo",
    createdAt: new Date(now.getTime() - 5 * 60_000).toISOString(),
  },
  {
    id: "k-002",
    orderNumber: "1043",
    customerName: "Joao Oliveira",
    itemsCount: 2,
    kitName: "Kit Low Carb",
    total: 59.8,
    status: "novo",
    createdAt: new Date(now.getTime() - 12 * 60_000).toISOString(),
  },
  {
    id: "k-003",
    orderNumber: "1039",
    customerName: "Ana Costa",
    itemsCount: 5,
    kitName: "Kit Familia",
    total: 149.5,
    status: "confirmado",
    createdAt: new Date(now.getTime() - 30 * 60_000).toISOString(),
  },
  {
    id: "k-004",
    orderNumber: "1040",
    customerName: "Carlos Souza",
    itemsCount: 1,
    total: 29.9,
    status: "confirmado",
    createdAt: new Date(now.getTime() - 45 * 60_000).toISOString(),
  },
  {
    id: "k-005",
    orderNumber: "1035",
    customerName: "Fernanda Lima",
    itemsCount: 4,
    kitName: "Kit Detox",
    total: 119.6,
    status: "em_producao",
    createdAt: new Date(now.getTime() - 60 * 60_000).toISOString(),
  },
  {
    id: "k-006",
    orderNumber: "1036",
    customerName: "Roberto Santos",
    itemsCount: 3,
    kitName: "Kit Fit Semanal",
    total: 89.7,
    status: "em_producao",
    createdAt: new Date(now.getTime() - 75 * 60_000).toISOString(),
  },
  {
    id: "k-007",
    orderNumber: "1033",
    customerName: "Lucia Ferreira",
    itemsCount: 2,
    kitName: "Kit Low Carb",
    total: 64.8,
    status: "pronto",
    createdAt: new Date(now.getTime() - 120 * 60_000).toISOString(),
  },
  {
    id: "k-008",
    orderNumber: "1028",
    customerName: "Paulo Mendes",
    itemsCount: 6,
    kitName: "Kit Familia",
    total: 179.4,
    status: "entregue",
    createdAt: new Date(now.getTime() - 240 * 60_000).toISOString(),
  },
  {
    id: "k-009",
    orderNumber: "1030",
    customerName: "Camila Rocha",
    itemsCount: 2,
    total: 49.8,
    status: "pronto",
    createdAt: new Date(now.getTime() - 150 * 60_000).toISOString(),
  },
  {
    id: "k-010",
    orderNumber: "1025",
    customerName: "Diego Almeida",
    itemsCount: 3,
    kitName: "Kit Detox",
    total: 94.5,
    status: "entregue",
    createdAt: new Date(now.getTime() - 300 * 60_000).toISOString(),
  },
];

// ---------------------------------------------------------------------------
// Kanban page
// ---------------------------------------------------------------------------

export default function Kanban() {
  const [orders, setOrders] = useState<KanbanOrder[]>(initialOrders);

  const handleTapCard = useCallback((order: KanbanOrder) => {
    // TODO: open order detail sheet/modal
    console.log("Tapped order:", order.id, order.customerName);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/60 via-white to-emerald-50/40">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-5">
          <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
            Kanban
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Arraste os pedidos ou toque na seta para avancar o status
          </p>
        </div>

        {/* Board */}
        <KanbanBoard
          orders={orders}
          onOrdersChange={setOrders}
          onTapCard={handleTapCard}
        />
      </div>
    </div>
  );
}
