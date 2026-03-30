import { Clock, Package } from "lucide-react";
import { OrderStatusBadge, type OrderStatus } from "./OrderStatusBadge";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface OrderSummary {
  id: string;
  orderNumber: number;
  customerName: string;
  kitName: string;
  total: number;
  status: OrderStatus;
  itemsCount: number;
  createdAt: string;
}

interface OrderCardProps {
  order: OrderSummary;
  onClick?: (order: OrderSummary) => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function OrderCard({ order, onClick }: OrderCardProps) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(order)}
      className="w-full text-left rounded-2xl bg-white border border-border/60 p-4 hover:shadow-md hover:border-emerald-200 transition-all active:scale-[0.98]"
    >
      {/* Top row: order number + status badge */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="font-heading text-sm font-bold text-emerald-700">
          #{order.orderNumber}
        </span>
        <OrderStatusBadge status={order.status} />
      </div>

      {/* Middle: customer + kit */}
      <div className="mb-3">
        <p className="font-medium text-sm text-gray-900 truncate">
          {order.customerName}
        </p>
        <p className="text-xs text-muted-foreground truncate mt-0.5">
          {order.kitName}
        </p>
      </div>

      {/* Bottom row: items count + time | total */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 text-muted-foreground">
          <span className="flex items-center gap-1 text-xs">
            <Package className="h-3.5 w-3.5" />
            {order.itemsCount} {order.itemsCount === 1 ? "item" : "itens"}
          </span>
          <span className="flex items-center gap-1 text-xs">
            <Clock className="h-3.5 w-3.5" />
            {timeAgo(order.createdAt)}
          </span>
        </div>

        <span className="font-heading font-bold text-sm text-gray-900">
          {formatCurrency(order.total)}
        </span>
      </div>
    </button>
  );
}
