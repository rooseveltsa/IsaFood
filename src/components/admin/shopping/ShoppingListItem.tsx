import { Checkbox } from "@/components/ui/checkbox";

// ---------------------------------------------------------------------------
// TODO: Replace with Supabase types from database schema.
// ---------------------------------------------------------------------------

export interface ShoppingListItemProps {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  isChecked: boolean;
  onToggle: (id: string) => void;
}

export function ShoppingListItem({
  id,
  name,
  quantity,
  unit,
  isChecked,
  onToggle,
}: ShoppingListItemProps) {
  return (
    <button
      type="button"
      onClick={() => onToggle(id)}
      className={`flex items-center gap-3 w-full rounded-xl px-4 py-3 transition-all duration-200 ease-in-out ${
        isChecked
          ? "bg-gray-50 opacity-50"
          : "bg-white shadow-sm shadow-emerald-900/5 active:scale-[0.98]"
      }`}
    >
      {/* Large touch-target checkbox — 44px min */}
      <div className="flex items-center justify-center min-w-[44px] min-h-[44px]">
        <Checkbox
          checked={isChecked}
          onCheckedChange={() => onToggle(id)}
          className={`h-6 w-6 rounded-md border-2 transition-colors ${
            isChecked
              ? "border-emerald-500 bg-emerald-500 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
              : "border-gray-300"
          }`}
        />
      </div>

      {/* Name + quantity */}
      <div className="flex flex-1 items-center justify-between min-w-0">
        <span
          className={`text-sm font-medium font-['Plus_Jakarta_Sans'] truncate transition-all duration-200 ${
            isChecked ? "line-through text-gray-400" : "text-gray-800"
          }`}
        >
          {name}
        </span>
        <span
          className={`text-sm font-semibold font-['Plus_Jakarta_Sans'] ml-3 whitespace-nowrap transition-all duration-200 ${
            isChecked ? "line-through text-gray-400" : "text-emerald-700"
          }`}
        >
          {quantity} {unit}
        </span>
      </div>
    </button>
  );
}
