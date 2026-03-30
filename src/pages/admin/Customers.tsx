import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Users, TrendingUp, DollarSign, Plus } from "lucide-react";
import {
  CustomerCard,
  type Customer,
} from "@/components/admin/customers/CustomerCard";

// ---------------------------------------------------------------------------
// TODO: Replace mock data with Supabase queries via @tanstack/react-query.
// Example:
//   const { data: customers } = useQuery({
//     queryKey: ["admin", "customers", searchTerm],
//     queryFn: () => fetchCustomers({ search: searchTerm }),
//   });
//
// TODO: Stats should come from a Supabase RPC or view:
//   const { data: stats } = useQuery({
//     queryKey: ["admin", "customer-stats"],
//     queryFn: () => fetchCustomerStats(),
//   });
//
// TODO: "Add customer" should open a dialog/drawer with a form that inserts
//   into the customers table via Supabase.
// ---------------------------------------------------------------------------

// -- Mock data ---------------------------------------------------------------
const now = new Date();

const mockCustomers: Customer[] = [
  {
    id: "cust-001",
    name: "Maria Silva",
    phone: "(61) 99812-3456",
    email: "maria.silva@email.com",
    neighborhood: "Asa Sul",
    totalOrders: 47,
    totalSpent: 4230,
    lastOrderDate: new Date(now.getTime() - 1 * 86400000).toISOString(),
    memberSince: "2024-03-15",
    dietaryRestrictions: ["Sem gluten"],
    avatarGradient: "bg-gradient-to-br from-emerald-400 to-emerald-600",
  },
  {
    id: "cust-002",
    name: "Joao Oliveira",
    phone: "(61) 98765-4321",
    email: "joao.oliveira@email.com",
    neighborhood: "Lago Norte",
    totalOrders: 32,
    totalSpent: 3180,
    lastOrderDate: new Date(now.getTime() - 2 * 86400000).toISOString(),
    memberSince: "2024-06-22",
    dietaryRestrictions: ["Low carb", "Sem lactose"],
    avatarGradient: "bg-gradient-to-br from-blue-400 to-blue-600",
  },
  {
    id: "cust-003",
    name: "Ana Costa",
    phone: "(61) 99654-7890",
    email: "ana.costa@email.com",
    neighborhood: "Sudoeste",
    totalOrders: 58,
    totalSpent: 5890,
    lastOrderDate: new Date(now.getTime() - 0.5 * 86400000).toISOString(),
    memberSince: "2024-01-10",
    dietaryRestrictions: ["Vegano"],
    avatarGradient: "bg-gradient-to-br from-purple-400 to-purple-600",
  },
  {
    id: "cust-004",
    name: "Carlos Souza",
    phone: "(61) 98321-6543",
    email: "carlos.souza@email.com",
    neighborhood: "Asa Norte",
    totalOrders: 12,
    totalSpent: 1080,
    lastOrderDate: new Date(now.getTime() - 7 * 86400000).toISOString(),
    memberSince: "2025-01-05",
    dietaryRestrictions: [],
    avatarGradient: "bg-gradient-to-br from-amber-400 to-amber-600",
  },
  {
    id: "cust-005",
    name: "Fernanda Lima",
    phone: "(61) 99123-4567",
    email: "fernanda.lima@email.com",
    neighborhood: "Aguas Claras",
    totalOrders: 24,
    totalSpent: 2340,
    lastOrderDate: new Date(now.getTime() - 3 * 86400000).toISOString(),
    memberSince: "2024-09-18",
    dietaryRestrictions: ["Sem lactose"],
    avatarGradient: "bg-gradient-to-br from-pink-400 to-pink-600",
  },
  {
    id: "cust-006",
    name: "Ricardo Mendes",
    phone: "(61) 98456-7891",
    email: "ricardo.mendes@email.com",
    neighborhood: "Guara",
    totalOrders: 8,
    totalSpent: 640,
    lastOrderDate: new Date(now.getTime() - 14 * 86400000).toISOString(),
    memberSince: "2025-02-12",
    dietaryRestrictions: ["Diabetico", "Low carb"],
    avatarGradient: "bg-gradient-to-br from-red-400 to-red-600",
  },
  {
    id: "cust-007",
    name: "Juliana Ferreira",
    phone: "(61) 99876-5432",
    email: "juliana.ferreira@email.com",
    neighborhood: "Lago Sul",
    totalOrders: 63,
    totalSpent: 7560,
    lastOrderDate: new Date(now.getTime() - 1 * 86400000).toISOString(),
    memberSince: "2023-11-20",
    dietaryRestrictions: ["Keto"],
    avatarGradient: "bg-gradient-to-br from-teal-400 to-teal-600",
  },
  {
    id: "cust-008",
    name: "Pedro Almeida",
    phone: "(61) 98111-2233",
    email: "pedro.almeida@email.com",
    neighborhood: "Taguatinga",
    totalOrders: 19,
    totalSpent: 1710,
    lastOrderDate: new Date(now.getTime() - 5 * 86400000).toISOString(),
    memberSince: "2024-11-03",
    dietaryRestrictions: ["Vegetariano"],
    avatarGradient: "bg-gradient-to-br from-indigo-400 to-indigo-600",
  },
  {
    id: "cust-009",
    name: "Larissa Rocha",
    phone: "(61) 99345-6789",
    email: "larissa.rocha@email.com",
    neighborhood: "Noroeste",
    totalOrders: 41,
    totalSpent: 4510,
    lastOrderDate: new Date(now.getTime() - 2 * 86400000).toISOString(),
    memberSince: "2024-04-08",
    dietaryRestrictions: ["Sem gluten", "Sem lactose"],
    avatarGradient: "bg-gradient-to-br from-cyan-400 to-cyan-600",
  },
  {
    id: "cust-010",
    name: "Bruno Martins",
    phone: "(61) 98222-3344",
    email: "bruno.martins@email.com",
    neighborhood: "Samambaia",
    totalOrders: 5,
    totalSpent: 399,
    lastOrderDate: new Date(now.getTime() - 21 * 86400000).toISOString(),
    memberSince: "2025-03-01",
    dietaryRestrictions: ["Sem frutos do mar"],
    avatarGradient: "bg-gradient-to-br from-orange-400 to-orange-600",
  },
];

// ---------------------------------------------------------------------------
// Customers page
// ---------------------------------------------------------------------------

export default function Customers() {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return mockCustomers;
    const lower = searchTerm.toLowerCase();
    return mockCustomers.filter(
      (c) =>
        c.name.toLowerCase().includes(lower) ||
        c.phone.includes(searchTerm)
    );
  }, [searchTerm]);

  // Sort by last order date (most recent first)
  const sorted = useMemo(
    () =>
      [...filtered].sort(
        (a, b) =>
          new Date(b.lastOrderDate).getTime() -
          new Date(a.lastOrderDate).getTime()
      ),
    [filtered]
  );

  // Stats
  const totalCustomers = mockCustomers.length;
  const activeThisMonth = mockCustomers.filter((c) => {
    const d = new Date(c.lastOrderDate);
    return (
      d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    );
  }).length;
  const averageTicket =
    mockCustomers.reduce((sum, c) => sum + c.totalSpent / c.totalOrders, 0) /
    totalCustomers;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/60 via-white to-emerald-50/40">
      <div className="mx-auto max-w-2xl px-4 py-6">
        {/* Header */}
        <div className="mb-5">
          <h1 className="font-['Sora'] text-2xl font-bold tracking-tight text-gray-900">
            Clientes
          </h1>
          <p className="text-sm text-muted-foreground mt-1 font-['Plus_Jakarta_Sans']">
            Gerencie sua base de clientes
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por nome ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 rounded-xl border-gray-200 bg-white shadow-sm font-['Plus_Jakarta_Sans'] h-11"
          />
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <Card className="rounded-2xl border-0 shadow-sm shadow-emerald-900/5 p-3 flex flex-col items-center">
            <Users className="h-4 w-4 text-emerald-500 mb-1" />
            <span className="text-lg font-bold text-gray-800 font-['Sora']">
              {totalCustomers}
            </span>
            <span className="text-[10px] text-gray-400 font-['Plus_Jakarta_Sans']">
              Total
            </span>
          </Card>
          <Card className="rounded-2xl border-0 shadow-sm shadow-emerald-900/5 p-3 flex flex-col items-center">
            <TrendingUp className="h-4 w-4 text-blue-500 mb-1" />
            <span className="text-lg font-bold text-gray-800 font-['Sora']">
              {activeThisMonth}
            </span>
            <span className="text-[10px] text-gray-400 font-['Plus_Jakarta_Sans']">
              Ativos (mes)
            </span>
          </Card>
          <Card className="rounded-2xl border-0 shadow-sm shadow-emerald-900/5 p-3 flex flex-col items-center">
            <DollarSign className="h-4 w-4 text-amber-500 mb-1" />
            <span className="text-lg font-bold text-gray-800 font-['Sora']">
              R$ {averageTicket.toFixed(0)}
            </span>
            <span className="text-[10px] text-gray-400 font-['Plus_Jakarta_Sans']">
              Ticket medio
            </span>
          </Card>
        </div>

        {/* Customer list */}
        <div className="space-y-3">
          {sorted.map((customer) => (
            <CustomerCard key={customer.id} customer={customer} />
          ))}

          {sorted.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Users className="h-10 w-10 text-gray-300 mb-3" />
              <p className="text-sm text-gray-400 font-['Plus_Jakarta_Sans']">
                Nenhum cliente encontrado para "{searchTerm}"
              </p>
            </div>
          )}
        </div>

        {/* Floating add button */}
        <Button
          // TODO: Open add customer dialog/drawer
          onClick={() => {}}
          className="fixed bottom-24 right-5 lg:bottom-8 lg:right-8 h-14 w-14 rounded-full bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/30 p-0 z-40"
        >
          <Plus className="h-6 w-6 text-white" />
        </Button>
      </div>
    </div>
  );
}
