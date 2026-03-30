import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { KanbanCard } from "./KanbanCard";
import type { KanbanOrder, OrderStatus } from "@/pages/admin/Kanban";

interface KanbanColumnProps {
  status: OrderStatus;
  title: string;
  color: string;
  dotColor: string;
  bgColor: string;
  orders: KanbanOrder[];
  isLastStatus: boolean;
  onTapCard: (order: KanbanOrder) => void;
  onAdvanceCard: (order: KanbanOrder) => void;
}

export function KanbanColumn({
  status,
  title,
  dotColor,
  bgColor,
  orders,
  isLastStatus,
  onTapCard,
  onAdvanceCard,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div
      className={`
        flex-shrink-0 flex flex-col
        w-[85vw] md:w-full md:min-w-[220px]
        rounded-2xl ${bgColor}
        ${isOver ? "ring-2 ring-emerald-400/60" : ""}
        transition-all duration-150
        snap-center
      `}
    >
      {/* Column header */}
      <div className="flex items-center gap-2 px-4 pt-4 pb-2">
        <span className={`w-2.5 h-2.5 rounded-full ${dotColor}`} />
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
        <span className="ml-auto text-xs font-bold text-gray-400 bg-white/80 rounded-full px-2 py-0.5 min-w-[24px] text-center">
          {orders.length}
        </span>
      </div>

      {/* Scrollable card list */}
      <div
        ref={setNodeRef}
        className="flex-1 overflow-y-auto px-3 pb-4 pt-1 space-y-2 min-h-[200px]"
      >
        <SortableContext
          items={orders.map((o) => o.id)}
          strategy={verticalListSortingStrategy}
        >
          {orders.map((order) => (
            <KanbanCard
              key={order.id}
              order={order}
              onTap={onTapCard}
              onAdvance={onAdvanceCard}
              isLastStatus={isLastStatus}
            />
          ))}
        </SortableContext>

        {orders.length === 0 && (
          <div className="flex items-center justify-center h-24 text-xs text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
            Nenhum pedido
          </div>
        )}
      </div>
    </div>
  );
}
