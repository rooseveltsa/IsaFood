import { useState, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { KanbanColumn } from "./KanbanColumn";
import { KanbanCard } from "./KanbanCard";
import type { KanbanOrder, OrderStatus } from "@/pages/admin/Kanban";

// -- Column definitions -------------------------------------------------------

export interface ColumnDef {
  status: OrderStatus;
  title: string;
  color: string;
  dotColor: string;
  bgColor: string;
}

export const COLUMNS: ColumnDef[] = [
  {
    status: "novo",
    title: "Novo",
    color: "blue",
    dotColor: "bg-blue-500",
    bgColor: "bg-blue-50/70",
  },
  {
    status: "confirmado",
    title: "Confirmado",
    color: "emerald",
    dotColor: "bg-emerald-500",
    bgColor: "bg-emerald-50/70",
  },
  {
    status: "em_producao",
    title: "Em Producao",
    color: "amber",
    dotColor: "bg-amber-500",
    bgColor: "bg-amber-50/70",
  },
  {
    status: "pronto",
    title: "Pronto",
    color: "purple",
    dotColor: "bg-purple-500",
    bgColor: "bg-purple-50/70",
  },
  {
    status: "entregue",
    title: "Entregue",
    color: "gray",
    dotColor: "bg-gray-400",
    bgColor: "bg-gray-50/70",
  },
];

const STATUS_ORDER: OrderStatus[] = COLUMNS.map((c) => c.status);

// -- Board component ----------------------------------------------------------

interface KanbanBoardProps {
  orders: KanbanOrder[];
  onOrdersChange: (orders: KanbanOrder[]) => void;
  onTapCard: (order: KanbanOrder) => void;
}

export function KanbanBoard({
  orders,
  onOrdersChange,
  onTapCard,
}: KanbanBoardProps) {
  const [activeOrder, setActiveOrder] = useState<KanbanOrder | null>(null);

  // Touch sensor with delay to avoid scroll conflicts
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 200,
      tolerance: 5,
    },
  });

  const keyboardSensor = useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates,
  });

  const sensors = useSensors(touchSensor, keyboardSensor);

  // Group orders by status
  const ordersByStatus = COLUMNS.reduce(
    (acc, col) => {
      acc[col.status] = orders.filter((o) => o.status === col.status);
      return acc;
    },
    {} as Record<OrderStatus, KanbanOrder[]>,
  );

  // Find which column an order ID belongs to
  const findContainer = useCallback(
    (id: string): OrderStatus | undefined => {
      // Check if it is a column ID
      if (STATUS_ORDER.includes(id as OrderStatus)) {
        return id as OrderStatus;
      }
      // Otherwise find the order
      const order = orders.find((o) => o.id === id);
      return order?.status;
    },
    [orders],
  );

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const { active } = event;
      const order = orders.find((o) => o.id === active.id);
      if (order) setActiveOrder(order);
    },
    [orders],
  );

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;
      if (!over) return;

      const activeContainer = findContainer(active.id as string);
      const overContainer = findContainer(over.id as string);

      if (!activeContainer || !overContainer || activeContainer === overContainer) {
        return;
      }

      // Move order to new column
      onOrdersChange(
        orders.map((o) =>
          o.id === active.id ? { ...o, status: overContainer } : o,
        ),
      );
    },
    [orders, onOrdersChange, findContainer],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveOrder(null);

      if (!over) return;

      const overContainer = findContainer(over.id as string);
      if (!overContainer) return;

      // Ensure the order lands in the right column
      const updated = orders.map((o) =>
        o.id === active.id ? { ...o, status: overContainer } : o,
      );
      onOrdersChange(updated);
    },
    [orders, onOrdersChange, findContainer],
  );

  // Advance order to next status
  const handleAdvance = useCallback(
    (order: KanbanOrder) => {
      const currentIdx = STATUS_ORDER.indexOf(order.status);
      if (currentIdx < STATUS_ORDER.length - 1) {
        const nextStatus = STATUS_ORDER[currentIdx + 1];
        onOrdersChange(
          orders.map((o) =>
            o.id === order.id ? { ...o, status: nextStatus } : o,
          ),
        );
      }
    },
    [orders, onOrdersChange],
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      {/* Horizontal scroll container with snap */}
      <div
        className="
          flex gap-3 overflow-x-auto
          snap-x snap-mandatory
          md:snap-none md:grid md:grid-cols-5
          pb-4 -mx-4 px-4
          scrollbar-hide
        "
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {COLUMNS.map((col, idx) => (
          <KanbanColumn
            key={col.status}
            status={col.status}
            title={col.title}
            color={col.color}
            dotColor={col.dotColor}
            bgColor={col.bgColor}
            orders={ordersByStatus[col.status]}
            isLastStatus={idx === COLUMNS.length - 1}
            onTapCard={onTapCard}
            onAdvanceCard={handleAdvance}
          />
        ))}
      </div>

      {/* Drag overlay for visual feedback */}
      <DragOverlay>
        {activeOrder ? (
          <div className="opacity-90 rotate-2">
            <KanbanCard
              order={activeOrder}
              onTap={() => {}}
              onAdvance={() => {}}
              isLastStatus={false}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
