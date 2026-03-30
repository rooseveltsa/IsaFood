import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ShoppingBag, DollarSign } from "lucide-react";

// ---------------------------------------------------------------------------
// TODO: Replace with Supabase types from database schema.
// ---------------------------------------------------------------------------

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  neighborhood: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string; // ISO date
  memberSince: string; // ISO date
  dietaryRestrictions: string[];
  avatarGradient: string; // tailwind gradient class
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function getRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Hoje";
  if (diffDays === 1) return "Ontem";
  if (diffDays < 7) return `${diffDays} dias atras`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} sem. atras`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} meses atras`;
  return `${Math.floor(diffDays / 365)} ano(s) atras`;
}

const restrictionColors: Record<string, string> = {
  "Sem gluten": "bg-amber-50 text-amber-700 border-amber-200",
  "Sem lactose": "bg-blue-50 text-blue-700 border-blue-200",
  Vegano: "bg-green-50 text-green-700 border-green-200",
  Vegetariano: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Low carb": "bg-purple-50 text-purple-700 border-purple-200",
  Diabetico: "bg-red-50 text-red-700 border-red-200",
  "Sem frutos do mar": "bg-cyan-50 text-cyan-700 border-cyan-200",
  Keto: "bg-orange-50 text-orange-700 border-orange-200",
};

interface CustomerCardProps {
  customer: Customer;
}

export function CustomerCard({ customer }: CustomerCardProps) {
  const navigate = useNavigate();

  return (
    <Card
      onClick={() => navigate(`/admin/clientes/${customer.id}`)}
      className="rounded-2xl border-0 shadow-sm shadow-emerald-900/5 p-4 cursor-pointer active:scale-[0.98] transition-all duration-150 hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div
          className={`flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center text-white text-sm font-bold font-['Sora'] ${customer.avatarGradient}`}
        >
          {getInitials(customer.name)}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-800 font-['Plus_Jakarta_Sans'] truncate">
              {customer.name}
            </h3>
            <span className="text-[10px] text-gray-400 font-['Plus_Jakarta_Sans'] whitespace-nowrap ml-2">
              {getRelativeTime(customer.lastOrderDate)}
            </span>
          </div>

          <p className="text-xs text-gray-400 font-['Plus_Jakarta_Sans'] mt-0.5">
            {customer.phone} &middot; {customer.neighborhood}
          </p>

          {/* Stats row */}
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1 text-xs text-gray-500 font-['Plus_Jakarta_Sans']">
              <ShoppingBag className="h-3.5 w-3.5 text-emerald-500" />
              <span className="font-semibold">{customer.totalOrders}</span> pedidos
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500 font-['Plus_Jakarta_Sans']">
              <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
              <span className="font-semibold">
                R$ {customer.totalSpent.toLocaleString("pt-BR")}
              </span>
            </div>
          </div>

          {/* Dietary restriction tags */}
          {customer.dietaryRestrictions.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {customer.dietaryRestrictions.map((restriction) => (
                <Badge
                  key={restriction}
                  className={`text-[10px] px-1.5 py-0 h-5 rounded-md border font-['Plus_Jakarta_Sans'] ${
                    restrictionColors[restriction] ??
                    "bg-gray-50 text-gray-600 border-gray-200"
                  }`}
                >
                  {restriction}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
