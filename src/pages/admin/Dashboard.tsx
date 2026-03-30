import { useState } from "react";
import { DollarSign, ShoppingBag, Flame, Users } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/admin/dashboard/MetricCard";
import {
  RecentOrdersList,
  type RecentOrder,
} from "@/components/admin/dashboard/RecentOrdersList";

// ---------------------------------------------------------------------------
// TODO: Replace mock data with Supabase queries via @tanstack/react-query.
// Example:
//   const { data: metrics } = useQuery({
//     queryKey: ["admin", "metrics", period],
//     queryFn: () => fetchDashboardMetrics(period),
//   });
// ---------------------------------------------------------------------------

type Period = "hoje" | "semana" | "mes";

// -- Mock: metric cards -----------------------------------------------------
const mockMetrics: Record<
  Period,
  { revenue: string; revenueChange: number; orders: string; ordersChange: number; production: string; productionChange: number; customers: string; customersChange: number }
> = {
  hoje: {
    revenue: "R$ 2.480",
    revenueChange: 12,
    orders: "34",
    ordersChange: 8,
    production: "6",
    productionChange: -5,
    customers: "28",
    customersChange: 15,
  },
  semana: {
    revenue: "R$ 14.320",
    revenueChange: 18,
    orders: "187",
    ordersChange: 12,
    production: "14",
    productionChange: 3,
    customers: "142",
    customersChange: 22,
  },
  mes: {
    revenue: "R$ 52.900",
    revenueChange: 24,
    orders: "723",
    ordersChange: 16,
    production: "8",
    productionChange: -2,
    customers: "389",
    customersChange: 30,
  },
};

// -- Mock: revenue chart ----------------------------------------------------
const mockRevenueData: Record<Period, { label: string; receita: number }[]> = {
  hoje: [
    { label: "08h", receita: 120 },
    { label: "09h", receita: 280 },
    { label: "10h", receita: 450 },
    { label: "11h", receita: 680 },
    { label: "12h", receita: 920 },
    { label: "13h", receita: 780 },
    { label: "14h", receita: 540 },
    { label: "15h", receita: 390 },
    { label: "16h", receita: 310 },
  ],
  semana: [
    { label: "Seg", receita: 1800 },
    { label: "Ter", receita: 2200 },
    { label: "Qua", receita: 1950 },
    { label: "Qui", receita: 2480 },
    { label: "Sex", receita: 2750 },
    { label: "Sab", receita: 1640 },
    { label: "Dom", receita: 1500 },
  ],
  mes: [
    { label: "Sem 1", receita: 11200 },
    { label: "Sem 2", receita: 13400 },
    { label: "Sem 3", receita: 14800 },
    { label: "Sem 4", receita: 13500 },
  ],
};

// -- Mock: popular items ----------------------------------------------------
const mockPopularItems: Record<Period, { name: string; pedidos: number }[]> = {
  hoje: [
    { name: "Frango grelhado", pedidos: 14 },
    { name: "Carne moida", pedidos: 11 },
    { name: "Peixe assado", pedidos: 8 },
    { name: "Strogonoff", pedidos: 6 },
    { name: "Feijoada fit", pedidos: 5 },
  ],
  semana: [
    { name: "Frango grelhado", pedidos: 82 },
    { name: "Strogonoff", pedidos: 64 },
    { name: "Carne moida", pedidos: 58 },
    { name: "Peixe assado", pedidos: 47 },
    { name: "Feijoada fit", pedidos: 39 },
  ],
  mes: [
    { name: "Frango grelhado", pedidos: 312 },
    { name: "Strogonoff", pedidos: 248 },
    { name: "Carne moida", pedidos: 221 },
    { name: "Feijoada fit", pedidos: 189 },
    { name: "Peixe assado", pedidos: 167 },
  ],
};

// -- Mock: recent orders ----------------------------------------------------
const now = new Date();
const mockRecentOrders: RecentOrder[] = [
  {
    id: "ord-001",
    customerName: "Maria Silva",
    itemsCount: 3,
    total: 89.7,
    status: "novo",
    createdAt: new Date(now.getTime() - 5 * 60000).toISOString(),
  },
  {
    id: "ord-002",
    customerName: "Joao Oliveira",
    itemsCount: 2,
    total: 59.8,
    status: "confirmado",
    createdAt: new Date(now.getTime() - 22 * 60000).toISOString(),
  },
  {
    id: "ord-003",
    customerName: "Ana Costa",
    itemsCount: 5,
    total: 149.5,
    status: "em_producao",
    createdAt: new Date(now.getTime() - 45 * 60000).toISOString(),
  },
  {
    id: "ord-004",
    customerName: "Carlos Souza",
    itemsCount: 1,
    total: 29.9,
    status: "pronto",
    createdAt: new Date(now.getTime() - 90 * 60000).toISOString(),
  },
  {
    id: "ord-005",
    customerName: "Fernanda Lima",
    itemsCount: 4,
    total: 119.6,
    status: "entregue",
    createdAt: new Date(now.getTime() - 180 * 60000).toISOString(),
  },
];

// ---------------------------------------------------------------------------
// Dashboard page
// ---------------------------------------------------------------------------

export default function Dashboard() {
  const [period, setPeriod] = useState<Period>("hoje");
  const metrics = mockMetrics[period];
  const revenueData = mockRevenueData[period];
  const popularItems = mockPopularItems[period];

  const periods: { key: Period; label: string }[] = [
    { key: "hoje", label: "Hoje" },
    { key: "semana", label: "Semana" },
    { key: "mes", label: "Mes" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/60 via-white to-emerald-50/40">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
              Dashboard
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Visao geral do seu negocio
            </p>
          </div>

          {/* Period filter */}
          <div className="flex gap-1.5 bg-muted/60 rounded-xl p-1">
            {periods.map((p) => (
              <Button
                key={p.key}
                size="sm"
                variant={period === p.key ? "default" : "ghost"}
                className={`rounded-lg text-xs font-semibold px-4 ${
                  period === p.key
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                    : "hover:bg-white/80 text-muted-foreground"
                }`}
                onClick={() => setPeriod(p.key)}
              >
                {p.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Metric cards — 2x2 mobile, 4-col desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <MetricCard
            title="Faturamento hoje"
            value={metrics.revenue}
            change={metrics.revenueChange}
            icon={DollarSign}
            color="emerald"
          />
          <MetricCard
            title="Pedidos hoje"
            value={metrics.orders}
            change={metrics.ordersChange}
            icon={ShoppingBag}
            color="blue"
          />
          <MetricCard
            title="Em producao"
            value={metrics.production}
            change={metrics.productionChange}
            icon={Flame}
            color="amber"
          />
          <MetricCard
            title="Clientes ativos"
            value={metrics.customers}
            change={metrics.customersChange}
            icon={Users}
            color="purple"
          />
        </div>

        {/* Revenue chart */}
        <Card className="rounded-2xl border-0 shadow-lg shadow-emerald-900/5 p-5 mb-6">
          <h3 className="font-heading font-semibold text-lg mb-4">Receita</h3>
          <div className="h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradientReceita" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 12, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: number) => `R$${v}`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    fontSize: "13px",
                  }}
                  formatter={(value: number) => [
                    `R$ ${value.toLocaleString("pt-BR")}`,
                    "Receita",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="receita"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fill="url(#gradientReceita)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Bottom row: Recent orders + Popular items */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Recent orders */}
          <RecentOrdersList orders={mockRecentOrders} />

          {/* Popular items bar chart */}
          <Card className="rounded-2xl border-0 shadow-lg shadow-emerald-900/5">
            <div className="p-5 pb-3">
              <h3 className="font-heading font-semibold text-lg">Itens populares</h3>
              <p className="text-sm text-muted-foreground mt-0.5">Top 5 mais pedidos</p>
            </div>
            <div className="px-5 pb-5">
              <div className="h-64 sm:h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={popularItems}
                    layout="vertical"
                    margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                    <XAxis
                      type="number"
                      tick={{ fontSize: 12, fill: "#9ca3af" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fontSize: 12, fill: "#6b7280" }}
                      axisLine={false}
                      tickLine={false}
                      width={110}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "12px",
                        border: "none",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                        fontSize: "13px",
                      }}
                      formatter={(value: number) => [`${value} pedidos`, "Quantidade"]}
                    />
                    <Bar
                      dataKey="pedidos"
                      fill="#10b981"
                      radius={[0, 6, 6, 0]}
                      barSize={20}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
