import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  CalendarDays,
  ListChecks,
  PackageCheck,
  DollarSign,
} from "lucide-react";
import { ShoppingListItem } from "@/components/admin/shopping/ShoppingListItem";

// ---------------------------------------------------------------------------
// TODO: Replace mock data with Supabase queries.
// Example:
//   const { data: shoppingList } = useQuery({
//     queryKey: ["admin", "shopping-list", targetDate],
//     queryFn: () => generateShoppingList(targetDate),
//   });
//
// TODO: "Gerar Lista" should call a Supabase Edge Function that:
//   1. Reads confirmed orders for the target date
//   2. Aggregates ingredient quantities
//   3. Returns grouped shopping list
//
// TODO: Persist checked state in Supabase so multiple users stay in sync.
// ---------------------------------------------------------------------------

type Category = "Proteinas" | "Legumes" | "Graos" | "Temperos";

interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: Category;
  estimatedCost: number;
}

const categoryOrder: Category[] = ["Proteinas", "Legumes", "Graos", "Temperos"];

const categoryColors: Record<Category, string> = {
  Proteinas: "bg-red-50 text-red-700 border-red-200",
  Legumes: "bg-green-50 text-green-700 border-green-200",
  Graos: "bg-amber-50 text-amber-700 border-amber-200",
  Temperos: "bg-purple-50 text-purple-700 border-purple-200",
};

const categoryIcons: Record<Category, string> = {
  Proteinas: "🥩",
  Legumes: "🥦",
  Graos: "🌾",
  Temperos: "🧂",
};

// -- Mock data ---------------------------------------------------------------
const mockShoppingItems: ShoppingItem[] = [
  // Proteinas
  { id: "p1", name: "Peito de frango", quantity: 5, unit: "kg", category: "Proteinas", estimatedCost: 74.5 },
  { id: "p2", name: "Patinho moido", quantity: 3, unit: "kg", category: "Proteinas", estimatedCost: 59.7 },
  { id: "p3", name: "File de tilapia", quantity: 2, unit: "kg", category: "Proteinas", estimatedCost: 45.8 },
  { id: "p4", name: "Ovos", quantity: 30, unit: "un", category: "Proteinas", estimatedCost: 22.9 },
  { id: "p5", name: "Peito de peru", quantity: 1.5, unit: "kg", category: "Proteinas", estimatedCost: 38.5 },
  // Legumes
  { id: "l1", name: "Brocolis", quantity: 3, unit: "kg", category: "Legumes", estimatedCost: 17.7 },
  { id: "l2", name: "Abobrinha", quantity: 2, unit: "kg", category: "Legumes", estimatedCost: 9.8 },
  { id: "l3", name: "Cenoura", quantity: 2.5, unit: "kg", category: "Legumes", estimatedCost: 7.5 },
  { id: "l4", name: "Batata doce", quantity: 4, unit: "kg", category: "Legumes", estimatedCost: 19.6 },
  { id: "l5", name: "Espinafre", quantity: 1, unit: "kg", category: "Legumes", estimatedCost: 12.0 },
  // Graos
  { id: "g1", name: "Arroz integral", quantity: 5, unit: "kg", category: "Graos", estimatedCost: 29.5 },
  { id: "g2", name: "Feijao carioca", quantity: 3, unit: "kg", category: "Graos", estimatedCost: 18.9 },
  { id: "g3", name: "Quinoa", quantity: 0.5, unit: "kg", category: "Graos", estimatedCost: 14.5 },
  { id: "g4", name: "Aveia em flocos", quantity: 1, unit: "kg", category: "Graos", estimatedCost: 8.9 },
  // Temperos
  { id: "t1", name: "Azeite extra virgem", quantity: 1, unit: "L", category: "Temperos", estimatedCost: 29.9 },
  { id: "t2", name: "Alho", quantity: 0.5, unit: "kg", category: "Temperos", estimatedCost: 12.0 },
  { id: "t3", name: "Cebola", quantity: 2, unit: "kg", category: "Temperos", estimatedCost: 7.9 },
  { id: "t4", name: "Limao", quantity: 1, unit: "kg", category: "Temperos", estimatedCost: 5.9 },
];

// ---------------------------------------------------------------------------
// ShoppingList page
// ---------------------------------------------------------------------------

export default function ShoppingList() {
  const [isGenerated, setIsGenerated] = useState(false);
  const [targetDate, setTargetDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  });
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());

  const handleToggle = (id: string) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleGenerate = () => {
    // TODO: Call Supabase Edge Function to generate list from confirmed orders
    setIsGenerated(true);
    setCheckedIds(new Set());
  };

  // Group items by category, unchecked first within each group
  const groupedItems = useMemo(() => {
    if (!isGenerated) return [];

    return categoryOrder.map((category) => {
      const items = mockShoppingItems
        .filter((item) => item.category === category)
        .sort((a, b) => {
          const aChecked = checkedIds.has(a.id) ? 1 : 0;
          const bChecked = checkedIds.has(b.id) ? 1 : 0;
          return aChecked - bChecked;
        });
      return { category, items };
    });
  }, [isGenerated, checkedIds]);

  // Summary
  const totalItems = mockShoppingItems.length;
  const checkedItems = checkedIds.size;
  const estimatedCost = mockShoppingItems.reduce((sum, item) => sum + item.estimatedCost, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/60 via-white to-emerald-50/40">
      <div className="mx-auto max-w-2xl px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-['Sora'] text-2xl font-bold tracking-tight text-gray-900">
            Lista de Compras
          </h1>
          <p className="text-sm text-muted-foreground mt-1 font-['Plus_Jakarta_Sans']">
            Gere a lista a partir dos pedidos confirmados
          </p>
        </div>

        {/* Generate controls */}
        <Card className="rounded-2xl border-0 shadow-lg shadow-emerald-900/5 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label
                htmlFor="target-date"
                className="text-xs font-medium text-gray-500 font-['Plus_Jakarta_Sans'] mb-1.5 block"
              >
                Data alvo
              </label>
              <div className="relative">
                <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="target-date"
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="pl-10 rounded-xl border-gray-200 font-['Plus_Jakarta_Sans']"
                />
              </div>
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleGenerate}
                className="w-full sm:w-auto rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold font-['Plus_Jakarta_Sans'] px-6 h-10 shadow-md shadow-emerald-600/20"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Gerar Lista
              </Button>
            </div>
          </div>
        </Card>

        {/* Empty state */}
        {!isGenerated && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-20 w-20 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
              <ShoppingCart className="h-10 w-10 text-emerald-300" />
            </div>
            <h3 className="font-['Sora'] text-lg font-semibold text-gray-700 mb-1">
              Nenhuma lista gerada
            </h3>
            <p className="text-sm text-gray-400 font-['Plus_Jakarta_Sans'] max-w-xs">
              Selecione a data e clique em "Gerar Lista" para agregar os ingredientes dos pedidos confirmados.
            </p>
          </div>
        )}

        {/* Shopping list grouped by category */}
        {isGenerated && (
          <div className="space-y-5">
            {groupedItems.map(({ category, items }) => (
              <div key={category}>
                {/* Category header */}
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="text-lg">{categoryIcons[category]}</span>
                  <Badge
                    className={`rounded-lg border text-xs font-semibold font-['Plus_Jakarta_Sans'] ${categoryColors[category]}`}
                  >
                    {category}
                  </Badge>
                  <span className="text-xs text-gray-400 font-['Plus_Jakarta_Sans']">
                    {items.filter((i) => !checkedIds.has(i.id)).length} restantes
                  </span>
                </div>

                {/* Items */}
                <div className="space-y-2">
                  {items.map((item) => (
                    <ShoppingListItem
                      key={item.id}
                      id={item.id}
                      name={item.name}
                      quantity={item.quantity}
                      unit={item.unit}
                      category={item.category}
                      isChecked={checkedIds.has(item.id)}
                      onToggle={handleToggle}
                    />
                  ))}
                </div>
              </div>
            ))}

            {/* Summary */}
            <Card className="rounded-2xl border-0 shadow-lg shadow-emerald-900/5 p-4 mt-6">
              <h3 className="font-['Sora'] text-sm font-semibold text-gray-700 mb-3">
                Resumo
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col items-center p-3 rounded-xl bg-emerald-50/70">
                  <ListChecks className="h-5 w-5 text-emerald-600 mb-1" />
                  <span className="text-lg font-bold text-gray-800 font-['Sora']">
                    {totalItems}
                  </span>
                  <span className="text-[10px] text-gray-500 font-['Plus_Jakarta_Sans']">
                    Total itens
                  </span>
                </div>
                <div className="flex flex-col items-center p-3 rounded-xl bg-blue-50/70">
                  <PackageCheck className="h-5 w-5 text-blue-600 mb-1" />
                  <span className="text-lg font-bold text-gray-800 font-['Sora']">
                    {checkedItems}/{totalItems}
                  </span>
                  <span className="text-[10px] text-gray-500 font-['Plus_Jakarta_Sans']">
                    Comprados
                  </span>
                </div>
                <div className="flex flex-col items-center p-3 rounded-xl bg-amber-50/70">
                  <DollarSign className="h-5 w-5 text-amber-600 mb-1" />
                  <span className="text-lg font-bold text-gray-800 font-['Sora']">
                    R$ {estimatedCost.toFixed(0)}
                  </span>
                  <span className="text-[10px] text-gray-500 font-['Plus_Jakarta_Sans']">
                    Custo est.
                  </span>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
