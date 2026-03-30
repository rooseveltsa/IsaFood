import {
  MapPin,
  Phone,
  User,
  CreditCard,
  Clock,
  CheckCircle2,
  Circle,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import {
  OrderStatusBadge,
  getNextStatus,
  getStatusLabel,
  STATUS_ORDER,
  type OrderStatus,
} from "./OrderStatusBadge";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface StatusHistoryEntry {
  status: OrderStatus;
  timestamp: string;
}

export interface OrderFull {
  id: string;
  orderNumber: number;
  customerName: string;
  customerPhone: string;
  kitName: string;
  total: number;
  status: OrderStatus;
  itemsCount: number;
  createdAt: string;
  deliveryAddress: string;
  paymentMethod: string;
  notes: string;
  items: OrderItem[];
  statusHistory: StatusHistoryEntry[];
}

interface OrderDetailProps {
  order: OrderFull | null;
  open: boolean;
  onClose: () => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function formatDateTime(dateString: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
}

// Map status to the CTA label for advancing to the next status
const advanceLabels: Partial<Record<OrderStatus, string>> = {
  novo: "Confirmar Pedido",
  confirmado: "Iniciar Producao",
  em_producao: "Marcar como Pronto",
  pronto: "Marcar como Entregue",
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function OrderDetail({ order, open, onClose }: OrderDetailProps) {
  if (!order) return null;

  const nextStatus = getNextStatus(order.status);
  const advanceLabel = advanceLabels[order.status];

  // TODO: Replace with Supabase mutation to update order status
  const handleAdvanceStatus = () => {
    if (!nextStatus) return;
    console.log(`[TODO] Advance order ${order.id} to status: ${nextStatus}`);
    onClose();
  };

  return (
    <Drawer open={open} onOpenChange={(v) => !v && onClose()}>
      <DrawerContent className="max-h-[92vh]">
        <div className="overflow-y-auto px-4 pb-6">
          {/* Header */}
          <DrawerHeader className="px-0 pt-2 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <DrawerTitle className="font-heading text-xl">
                  Pedido #{order.orderNumber}
                </DrawerTitle>
                <DrawerDescription className="text-sm mt-1">
                  {formatDateTime(order.createdAt)}
                </DrawerDescription>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full hover:bg-muted transition-colors"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
            <div className="mt-2">
              <OrderStatusBadge status={order.status} />
            </div>
          </DrawerHeader>

          {/* Customer info */}
          <Section title="Cliente">
            <InfoRow icon={User} label={order.customerName} />
            <InfoRow icon={Phone} label={order.customerPhone} />
            <InfoRow icon={MapPin} label={order.deliveryAddress} />
          </Section>

          {/* Items */}
          <Section title="Itens">
            <div className="space-y-2">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-gray-700">
                    {item.quantity}x {item.name}
                  </span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(item.unitPrice * item.quantity)}
                  </span>
                </div>
              ))}
              <div className="border-t pt-2 flex items-center justify-between font-heading font-bold text-base">
                <span>Total</span>
                <span className="text-emerald-700">
                  {formatCurrency(order.total)}
                </span>
              </div>
            </div>
          </Section>

          {/* Payment */}
          <Section title="Pagamento">
            <InfoRow icon={CreditCard} label={order.paymentMethod} />
          </Section>

          {/* Notes */}
          {order.notes && (
            <Section title="Observacoes">
              <p className="text-sm text-gray-600">{order.notes}</p>
            </Section>
          )}

          {/* Status timeline */}
          <Section title="Historico">
            <div className="space-y-3">
              {STATUS_ORDER.map((s) => {
                const entry = order.statusHistory.find((h) => h.status === s);
                const isCompleted = !!entry;
                const isCurrent = s === order.status;

                return (
                  <div key={s} className="flex items-start gap-3">
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
                    ) : (
                      <Circle
                        className={`h-5 w-5 mt-0.5 shrink-0 ${
                          isCurrent
                            ? "text-emerald-400"
                            : "text-gray-300"
                        }`}
                      />
                    )}
                    <div>
                      <p
                        className={`text-sm font-medium ${
                          isCompleted ? "text-gray-900" : "text-gray-400"
                        }`}
                      >
                        {getStatusLabel(s)}
                      </p>
                      {entry && (
                        <p className="text-xs text-muted-foreground">
                          {formatDateTime(entry.timestamp)}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Section>

          {/* Action buttons */}
          {advanceLabel && nextStatus && (
            <div className="mt-6 space-y-2">
              <Button
                onClick={handleAdvanceStatus}
                className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-base"
              >
                {advanceLabel}
              </Button>
              {order.status !== "cancelado" && (
                <Button
                  variant="outline"
                  onClick={() => {
                    // TODO: Replace with Supabase mutation to cancel order
                    console.log(`[TODO] Cancel order ${order.id}`);
                    onClose();
                  }}
                  className="w-full h-12 rounded-xl text-red-600 border-red-200 hover:bg-red-50 font-semibold text-base"
                >
                  Cancelar Pedido
                </Button>
              )}
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5">
      <h4 className="font-heading font-semibold text-sm text-gray-500 uppercase tracking-wide mb-2">
        {title}
      </h4>
      {children}
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-700 mb-1.5">
      <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
      <span>{label}</span>
    </div>
  );
}
