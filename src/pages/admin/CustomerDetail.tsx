import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  ArrowLeft,
  Phone,
  MessageCircle,
  ShoppingBag,
  DollarSign,
  Calendar,
  Edit2,
  Save,
} from "lucide-react";

// ---------------------------------------------------------------------------
// TODO: Replace mock data with Supabase queries.
// Example:
//   const { data: customer } = useQuery({
//     queryKey: ["admin", "customer", customerId],
//     queryFn: () => fetchCustomer(customerId),
//   });
//
//   const { data: orders } = useQuery({
//     queryKey: ["admin", "customer-orders", customerId],
//     queryFn: () => fetchCustomerOrders(customerId),
//   });
//
// TODO: Notes save should upsert to Supabase:
//   const mutation = useMutation({
//     mutationFn: (notes: string) => updateCustomerNotes(customerId, notes),
//   });
//
// TODO: Preferences edit should update Supabase customer record.
// ---------------------------------------------------------------------------

// -- Mock data for a single detailed customer --------------------------------

interface OrderHistory {
  id: string;
  date: string;
  items: string[];
  total: number;
  status: "entregue" | "em_producao" | "confirmado" | "cancelado";
}

const mockCustomer = {
  id: "cust-003",
  name: "Ana Costa",
  phone: "(61) 99654-7890",
  email: "ana.costa@email.com",
  neighborhood: "Sudoeste",
  totalOrders: 58,
  totalSpent: 5890,
  memberSince: "2024-01-10",
  dietaryRestrictions: ["Vegano"],
  foodPreferences: [
    "Prefere temperos suaves",
    "Gosta de molhos naturais",
    "Nao gosta de pimentao",
    "Adora abobora",
  ],
  notes:
    "Cliente fiel desde janeiro/2024. Sempre pede para sexta. Gosta de receber mensagem no WhatsApp confirmando entrega.",
  avatarGradient: "bg-gradient-to-br from-purple-400 to-purple-600",
};

const mockOrders: OrderHistory[] = [
  {
    id: "ord-101",
    date: new Date(Date.now() - 1 * 86400000).toISOString(),
    items: ["Bowl vegano", "Suco verde", "Sobremesa fit"],
    total: 89.7,
    status: "entregue",
  },
  {
    id: "ord-095",
    date: new Date(Date.now() - 4 * 86400000).toISOString(),
    items: ["Kit semanal vegano"],
    total: 189.9,
    status: "entregue",
  },
  {
    id: "ord-088",
    date: new Date(Date.now() - 8 * 86400000).toISOString(),
    items: ["Bowl vegano", "Wrap de grão de bico"],
    total: 65.8,
    status: "entregue",
  },
  {
    id: "ord-072",
    date: new Date(Date.now() - 15 * 86400000).toISOString(),
    items: ["Kit semanal vegano", "Suco detox"],
    total: 209.8,
    status: "entregue",
  },
  {
    id: "ord-063",
    date: new Date(Date.now() - 22 * 86400000).toISOString(),
    items: ["Bowl vegano"],
    total: 39.9,
    status: "cancelado",
  },
  {
    id: "ord-055",
    date: new Date(Date.now() - 30 * 86400000).toISOString(),
    items: ["Kit semanal vegano", "Bowl vegano", "Suco verde"],
    total: 249.7,
    status: "entregue",
  },
];

const statusConfig: Record<
  OrderHistory["status"],
  { label: string; className: string }
> = {
  entregue: {
    label: "Entregue",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  em_producao: {
    label: "Em producao",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  confirmado: {
    label: "Confirmado",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  cancelado: {
    label: "Cancelado",
    className: "bg-red-50 text-red-700 border-red-200",
  },
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ---------------------------------------------------------------------------
// CustomerDetail page
// ---------------------------------------------------------------------------

export default function CustomerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [notes, setNotes] = useState(mockCustomer.notes);
  const [isSaving, setIsSaving] = useState(false);

  // TODO: Fetch customer by id from Supabase. For now we use mockCustomer
  // regardless of the id param.
  const customer = mockCustomer;
  void id; // suppress unused warning — will be used with Supabase

  const handleSaveNotes = async () => {
    setIsSaving(true);
    // TODO: Save notes to Supabase
    await new Promise((r) => setTimeout(r, 500));
    setIsSaving(false);
  };

  const whatsappLink = `https://wa.me/55${customer.phone.replace(/\D/g, "")}`;
  const telLink = `tel:+55${customer.phone.replace(/\D/g, "")}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/60 via-white to-emerald-50/40">
      <div className="mx-auto max-w-2xl px-4 py-6">
        {/* Back button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/admin/clientes")}
          className="mb-4 -ml-2 text-gray-500 hover:text-gray-700 font-['Plus_Jakarta_Sans']"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar
        </Button>

        {/* Header card */}
        <Card className="rounded-2xl border-0 shadow-lg shadow-emerald-900/5 p-5 mb-5">
          <div className="flex flex-col items-center text-center">
            {/* Large avatar */}
            <div
              className={`h-20 w-20 rounded-full flex items-center justify-center text-white text-2xl font-bold font-['Sora'] mb-3 ${customer.avatarGradient}`}
            >
              {getInitials(customer.name)}
            </div>

            <h1 className="font-['Sora'] text-xl font-bold text-gray-900">
              {customer.name}
            </h1>
            <p className="text-sm text-gray-400 font-['Plus_Jakarta_Sans'] mt-0.5">
              {customer.neighborhood}
            </p>

            {/* Action buttons */}
            <div className="flex gap-3 mt-4">
              <a href={telLink}>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl font-['Plus_Jakarta_Sans'] border-gray-200"
                >
                  <Phone className="h-4 w-4 mr-1.5 text-emerald-600" />
                  Ligar
                </Button>
              </a>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <Button
                  size="sm"
                  className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-['Plus_Jakarta_Sans']"
                >
                  <MessageCircle className="h-4 w-4 mr-1.5" />
                  WhatsApp
                </Button>
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-gray-100">
            <div className="flex flex-col items-center">
              <ShoppingBag className="h-4 w-4 text-emerald-500 mb-1" />
              <span className="text-lg font-bold text-gray-800 font-['Sora']">
                {customer.totalOrders}
              </span>
              <span className="text-[10px] text-gray-400 font-['Plus_Jakarta_Sans']">
                Pedidos
              </span>
            </div>
            <div className="flex flex-col items-center">
              <DollarSign className="h-4 w-4 text-emerald-500 mb-1" />
              <span className="text-lg font-bold text-gray-800 font-['Sora']">
                R$ {customer.totalSpent.toLocaleString("pt-BR")}
              </span>
              <span className="text-[10px] text-gray-400 font-['Plus_Jakarta_Sans']">
                Total gasto
              </span>
            </div>
            <div className="flex flex-col items-center">
              <Calendar className="h-4 w-4 text-emerald-500 mb-1" />
              <span className="text-lg font-bold text-gray-800 font-['Sora']">
                {new Date(customer.memberSince).toLocaleDateString("pt-BR", {
                  month: "short",
                  year: "2-digit",
                })}
              </span>
              <span className="text-[10px] text-gray-400 font-['Plus_Jakarta_Sans']">
                Membro desde
              </span>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="pedidos" className="w-full">
          <TabsList className="w-full rounded-xl bg-gray-100/80 p-1 h-auto">
            <TabsTrigger
              value="pedidos"
              className="flex-1 rounded-lg text-xs font-semibold font-['Plus_Jakarta_Sans'] py-2.5 data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm"
            >
              Pedidos
            </TabsTrigger>
            <TabsTrigger
              value="preferencias"
              className="flex-1 rounded-lg text-xs font-semibold font-['Plus_Jakarta_Sans'] py-2.5 data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm"
            >
              Preferencias
            </TabsTrigger>
            <TabsTrigger
              value="notas"
              className="flex-1 rounded-lg text-xs font-semibold font-['Plus_Jakarta_Sans'] py-2.5 data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm"
            >
              Notas
            </TabsTrigger>
          </TabsList>

          {/* Pedidos tab */}
          <TabsContent value="pedidos" className="mt-4 space-y-3">
            {mockOrders.map((order) => (
              <Card
                key={order.id}
                className="rounded-2xl border-0 shadow-sm shadow-emerald-900/5 p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400 font-['Plus_Jakarta_Sans']">
                    {formatDate(order.date)}
                  </span>
                  <Badge
                    className={`text-[10px] px-2 py-0.5 rounded-md border font-['Plus_Jakarta_Sans'] ${
                      statusConfig[order.status].className
                    }`}
                  >
                    {statusConfig[order.status].label}
                  </Badge>
                </div>
                <p className="text-sm text-gray-700 font-['Plus_Jakarta_Sans'] truncate">
                  {order.items.join(", ")}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-400 font-['Plus_Jakarta_Sans']">
                    {order.items.length} {order.items.length === 1 ? "item" : "itens"}
                  </span>
                  <span className="text-sm font-bold text-gray-800 font-['Sora']">
                    R$ {order.total.toFixed(2).replace(".", ",")}
                  </span>
                </div>
              </Card>
            ))}
          </TabsContent>

          {/* Preferencias tab */}
          <TabsContent value="preferencias" className="mt-4">
            <Card className="rounded-2xl border-0 shadow-lg shadow-emerald-900/5 p-5">
              {/* Dietary restrictions */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-700 font-['Plus_Jakarta_Sans']">
                    Restricoes alimentares
                  </h3>
                  <Button
                    // TODO: Open edit dialog for dietary restrictions
                    variant="ghost"
                    size="sm"
                    className="text-emerald-600 hover:text-emerald-700 h-8 px-2"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {customer.dietaryRestrictions.length > 0 ? (
                    customer.dietaryRestrictions.map((r) => (
                      <Badge
                        key={r}
                        className="rounded-lg border bg-emerald-50 text-emerald-700 border-emerald-200 font-['Plus_Jakarta_Sans'] text-xs px-3 py-1"
                      >
                        {r}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-gray-400 font-['Plus_Jakarta_Sans']">
                      Nenhuma restricao cadastrada
                    </span>
                  )}
                </div>
              </div>

              {/* Food preferences */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-700 font-['Plus_Jakarta_Sans']">
                    Preferencias alimentares
                  </h3>
                  <Button
                    // TODO: Open edit dialog for food preferences
                    variant="ghost"
                    size="sm"
                    className="text-emerald-600 hover:text-emerald-700 h-8 px-2"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <ul className="space-y-2">
                  {customer.foodPreferences.map((pref, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-sm text-gray-600 font-['Plus_Jakarta_Sans']"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                      {pref}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </TabsContent>

          {/* Notas tab */}
          <TabsContent value="notas" className="mt-4">
            <Card className="rounded-2xl border-0 shadow-lg shadow-emerald-900/5 p-5">
              <h3 className="text-sm font-semibold text-gray-700 font-['Plus_Jakarta_Sans'] mb-3">
                Anotacoes sobre o cliente
              </h3>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Adicione observacoes sobre este cliente..."
                className="min-h-[160px] rounded-xl border-gray-200 font-['Plus_Jakarta_Sans'] text-sm resize-none"
              />
              <Button
                onClick={handleSaveNotes}
                disabled={isSaving}
                className="mt-3 w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold font-['Plus_Jakarta_Sans'] shadow-md shadow-emerald-600/20"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Salvando..." : "Salvar notas"}
              </Button>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
