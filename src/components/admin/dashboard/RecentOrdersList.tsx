import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

type OrderStatus = "novo" | "confirmado" | "em_producao" | "pronto" | "entregue";

interface RecentOrder {
  id: string;
  customerName: string;
  itemsCount: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
}

interface RecentOrdersListProps {
  orders: RecentOrder[];
}

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  novo: {
    label: "Novo",
    className: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  },
  confirmado: {
    label: "Confirmado",
    className: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
  },
  em_producao: {
    label: "Em producao",
    className: "bg-amber-100 text-amber-700 hover:bg-amber-100",
  },
  pronto: {
    label: "Pronto",
    className: "bg-purple-100 text-purple-700 hover:bg-purple-100",
  },
  entregue: {
    label: "Entregue",
    className: "bg-gray-100 text-gray-600 hover:bg-gray-100",
  },
};

function timeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return "agora";
  if (diffMin < 60) return `${diffMin}min atras`;

  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h atras`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d atras`;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function RecentOrdersList({ orders }: RecentOrdersListProps) {
  return (
    <Card className="rounded-2xl border-0 shadow-lg shadow-emerald-900/5">
      <div className="p-5 pb-3">
        <h3 className="font-heading font-semibold text-lg">Pedidos recentes</h3>
        <p className="text-sm text-muted-foreground mt-0.5">Ultimos 5 pedidos</p>
      </div>

      <div className="px-5 pb-5 space-y-3">
        {orders.map((order) => {
          const status = statusConfig[order.status];

          return (
            // TODO: Replace with <Link to={`/admin/orders/${order.id}`}> when order detail page exists
            <button
              key={order.id}
              type="button"
              className="w-full text-left rounded-xl border border-border/60 p-3.5 hover:bg-muted/40 transition-colors"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm truncate">
                      {order.customerName}
                    </span>
                    <Badge
                      variant="secondary"
                      className={`text-[10px] px-1.5 py-0 font-semibold shrink-0 ${status.className}`}
                    >
                      {status.label}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {order.itemsCount} {order.itemsCount === 1 ? "item" : "itens"}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <p className="font-heading font-semibold text-sm">
                    {formatCurrency(order.total)}
                  </p>
                  <div className="flex items-center gap-1 justify-end mt-0.5">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-[11px] text-muted-foreground">
                      {timeAgo(order.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}

        {orders.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">
            Nenhum pedido encontrado.
          </p>
        )}
      </div>
    </Card>
  );
}

export type { RecentOrder, OrderStatus };
