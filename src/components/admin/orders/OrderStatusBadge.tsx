import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Order status types and configuration
// ---------------------------------------------------------------------------

export type OrderStatus =
  | "novo"
  | "confirmado"
  | "em_producao"
  | "pronto"
  | "entregue"
  | "cancelado";

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  novo: {
    label: "Novo",
    className: "bg-blue-100 text-blue-700",
  },
  confirmado: {
    label: "Confirmado",
    className: "bg-emerald-100 text-emerald-700",
  },
  em_producao: {
    label: "Em Producao",
    className: "bg-amber-100 text-amber-700",
  },
  pronto: {
    label: "Pronto",
    className: "bg-purple-100 text-purple-700",
  },
  entregue: {
    label: "Entregue",
    className: "bg-gray-100 text-gray-700",
  },
  cancelado: {
    label: "Cancelado",
    className: "bg-red-100 text-red-700",
  },
};

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold capitalize whitespace-nowrap",
        config.className,
        className,
      )}
    >
      {config.label}
    </span>
  );
}

/** Returns the display label for a given status */
export function getStatusLabel(status: OrderStatus): string {
  return statusConfig[status]?.label ?? status;
}

/** Returns all statuses in their natural workflow order */
export const STATUS_ORDER: OrderStatus[] = [
  "novo",
  "confirmado",
  "em_producao",
  "pronto",
  "entregue",
];

/** Returns the next status in the workflow, or null if already at the end */
export function getNextStatus(current: OrderStatus): OrderStatus | null {
  if (current === "cancelado") return null;
  const idx = STATUS_ORDER.indexOf(current);
  if (idx === -1 || idx === STATUS_ORDER.length - 1) return null;
  return STATUS_ORDER[idx + 1];
}
