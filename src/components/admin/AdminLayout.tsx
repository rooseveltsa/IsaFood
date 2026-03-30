import { Outlet } from "react-router-dom";
import { AdminTopBar } from "@/components/admin/shared/AdminTopBar";
import { AdminSidebar } from "@/components/admin/shared/AdminSidebar";
import { MobileBottomNav } from "@/components/admin/shared/MobileBottomNav";

interface AdminLayoutProps {
  pageTitle?: string;
}

export function AdminLayout({ pageTitle }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Desktop sidebar */}
      <AdminSidebar />

      {/* Main content area — offset on desktop for sidebar */}
      <div className="lg:pl-60 flex flex-col min-h-screen">
        {/* Top bar */}
        <AdminTopBar title={pageTitle} />

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 pb-20 lg:pb-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom nav */}
      <MobileBottomNav />
    </div>
  );
}
