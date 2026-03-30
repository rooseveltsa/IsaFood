import { NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  Columns3,
  ShoppingCart,
  Users,
  MessageCircle,
  Megaphone,
  UtensilsCrossed,
  Settings,
  ArrowLeft,
} from "lucide-react";

// TODO: Replace with real connection status from Supabase Realtime / WhatsApp API
const WHATSAPP_CONNECTED = true;

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/pedidos", label: "Pedidos", icon: ClipboardList },
  { to: "/admin/kanban", label: "Kanban", icon: Columns3 },
  { to: "/admin/compras", label: "Compras", icon: ShoppingCart },
  { to: "/admin/clientes", label: "Clientes", icon: Users },
  { to: "/admin/whatsapp", label: "WhatsApp", icon: MessageCircle, indicator: WHATSAPP_CONNECTED ? "connected" : "disconnected" },
  { to: "/admin/campanhas", label: "Campanhas", icon: Megaphone },
  { to: "/admin/cardapio", label: "Cardapio", icon: UtensilsCrossed },
  { to: "/admin/configuracoes", label: "Configuracoes", icon: Settings },
];

export function AdminSidebar() {
  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-60 lg:fixed lg:inset-y-0 bg-white border-r border-gray-100 z-30">
      {/* Logo */}
      <div className="flex items-center gap-3 h-14 px-5 border-b border-gray-100">
        <span className="flex items-center justify-center h-9 w-9 rounded-lg bg-emerald-600 text-white text-sm font-bold font-['Sora']">
          iF
        </span>
        <span className="text-base font-bold text-gray-800 font-['Sora']">
          Isa Fitness
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors font-['Plus_Jakarta_Sans'] ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`
                }
              >
                <span className="relative flex-shrink-0">
                  <item.icon className="h-5 w-5" />
                  {(item as any).indicator === "connected" && (
                    <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                  )}
                  {(item as any).indicator === "disconnected" && (
                    <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white" />
                  )}
                </span>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-gray-100">
        <Link
          to="/"
          className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors font-['Plus_Jakarta_Sans']"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao site
        </Link>
      </div>
    </aside>
  );
}
