import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ChevronRight, GripVertical, Package } from "lucide-react";
import type { KanbanOrder, OrderStatus } from "@/pages/admin/Kanban";

interface KanbanCardProps {
  order: KanbanOrder;
  onTap: (order: KanbanOrder) => void;
  onAdvance: (order: KanbanOrder) => void;
  isLastStatus: boolean;
}

const statusColors: Record<OrderStatus, string> = {
  novo: "border-l-blue-500",
  confirmado: "border-l-emerald-500",
  em_producao: "border-l-amber-500",
  pronto: "border-l-purple-500",
  entregue: "border-l-gray-400",
};

export function KanbanCard({
  order,
  onTap,
  onAdvance,
  isLastStatus,
}: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: order.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        group relative bg-white rounded-xl border-l-4 shadow-sm
        ${statusColors[order.status]}
        ${isDragging ? "opacity-60 scale-[1.03] shadow-lg ring-2 ring-emerald-300/50 z-50" : ""}
        transition-shadow duration-150
      `}
    >
      {/* Tappable area */}
      <button
        type="button"
        onClick={() => onTap(order)}
        className="w-full text-left p-3 min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1 rounded-r-xl"
      >
        <div className="flex items-start gap-2">
          {/* Drag handle */}
          <div
            {...attributes}
            {...listeners}
            className="flex-shrink-0 mt-0.5 touch-none cursor-grab active:cursor-grabbing p-1 -ml-1 rounded text-gray-300 hover:text-gray-500"
            aria-label="Arrastar pedido"
          >
            <GripVertical className="h-4 w-4" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-gray-900 truncate">
                {order.customerName}
              </span>
              <span className="text-[11px] text-gray-400 font-mono flex-shrink-0">
                #{order.orderNumber}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Package className="h-3 w-3" />
                <span>
                  {order.itemsCount} {order.itemsCount === 1 ? "item" : "itens"}
                </span>
              </div>
              {order.kitName && (
                <span className="text-[11px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-md truncate max-w-[120px]">
                  {order.kitName}
                </span>
              )}
            </div>
          </div>
        </div>
      </button>

      {/* Advance button */}
      {!isLastStatus && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onAdvance(order);
          }}
          className="
            absolute right-2 top-1/2 -translate-y-1/2
            flex items-center justify-center
            w-9 h-9 min-w-[44px] min-h-[44px]
            rounded-full bg-emerald-50 text-emerald-600
            hover:bg-emerald-100 active:bg-emerald-200
            transition-colors
            focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500
          "
          aria-label="Avancar pedido para proximo status"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
