import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  Columns3,
  MessageCircle,
  MoreHorizontal,
  ShoppingCart,
  Users,
  Megaphone,
  UtensilsCrossed,
  Settings,
  X,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

// TODO: Replace with real unread count from Supabase Realtime subscription
const MOCK_UNREAD_COUNT = 5;

const mainNavItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/pedidos", label: "Pedidos", icon: ClipboardList },
  { to: "/admin/kanban", label: "Kanban", icon: Columns3 },
  { to: "/admin/whatsapp", label: "WhatsApp", icon: MessageCircle, badge: MOCK_UNREAD_COUNT },
];

const moreNavItems = [
  { to: "/admin/compras", label: "Compras", icon: ShoppingCart },
  { to: "/admin/clientes", label: "Clientes", icon: Users },
  { to: "/admin/campanhas", label: "Campanhas", icon: Megaphone },
  { to: "/admin/cardapio", label: "Cardapio", icon: UtensilsCrossed },
  { to: "/admin/configuracoes", label: "Configuracoes", icon: Settings },
];

export function MobileBottomNav() {
  const [moreOpen, setMoreOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <nav className="fixed bottom-0 inset-x-0 z-50 bg-white border-t border-gray-200 lg:hidden pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around min-h-[64px]">
          {mainNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `relative flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 transition-colors ${
                  isActive
                    ? "text-emerald-600"
                    : "text-gray-400 hover:text-gray-600"
                }`
              }
            >
              <div className="relative">
                <item.icon className="h-6 w-6" />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 flex items-center justify-center h-4 min-w-[16px] rounded-full bg-emerald-600 text-white text-[9px] font-bold px-1">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 font-medium font-['Plus_Jakarta_Sans']">
                {item.label}
              </span>
            </NavLink>
          ))}

          {/* More button */}
          <button
            onClick={() => setMoreOpen(true)}
            className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 transition-colors ${
              moreOpen ? "text-emerald-600" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <MoreHorizontal className="h-6 w-6" />
            <span className="text-[10px] mt-0.5 font-medium font-['Plus_Jakarta_Sans']">
              Mais
            </span>
          </button>
        </div>
      </nav>

      {/* More sheet */}
      <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl pb-8">
          <SheetHeader className="text-left pb-2">
            <SheetTitle className="font-['Sora'] text-base">Mais opcoes</SheetTitle>
            <SheetDescription className="sr-only">Navegacao adicional</SheetDescription>
          </SheetHeader>
          <div className="grid grid-cols-3 gap-3 pt-2">
            {moreNavItems.map((item) => (
              <button
                key={item.to}
                onClick={() => {
                  setMoreOpen(false);
                  navigate(item.to);
                }}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gray-50 hover:bg-emerald-50 hover:text-emerald-700 text-gray-600 transition-colors"
              >
                <item.icon className="h-6 w-6" />
                <span className="text-xs font-medium font-['Plus_Jakarta_Sans']">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
