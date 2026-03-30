import { Bell, LogOut, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AdminTopBarProps {
  title?: string;
}

export function AdminTopBar({ title = "Dashboard" }: AdminTopBarProps) {
  const { user, signOut } = useAuth();

  const initials = user?.email
    ? user.email.substring(0, 2).toUpperCase()
    : "IF";

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between h-14 px-4 bg-white border-b border-gray-100">
      {/* Logo badge */}
      <div className="flex items-center gap-2">
        <span className="flex items-center justify-center h-8 w-8 rounded-lg bg-emerald-600 text-white text-sm font-bold font-['Sora']">
          iF
        </span>
        <span className="hidden sm:block text-sm font-semibold text-gray-700 font-['Sora']">
          Isa Fitness
        </span>
      </div>

      {/* Page title */}
      <h1 className="absolute left-1/2 -translate-x-1/2 text-base font-semibold text-gray-800 font-['Sora'] truncate max-w-[180px] sm:max-w-none">
        {title}
      </h1>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Notification indicator */}
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 text-gray-500 hover:text-emerald-600"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 w-9 rounded-full p-0">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xs font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-3 py-2">
              <p className="text-sm font-medium text-gray-900 font-['Plus_Jakarta_Sans']">
                Admin
              </p>
              <p className="text-xs text-gray-500 truncate font-['Plus_Jakarta_Sans']">
                {user?.email ?? "admin@isafitness.com"}
              </p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 text-gray-600">
              <User className="h-4 w-4" />
              Meu Perfil
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 text-red-600 focus:text-red-600"
              onClick={() => signOut()}
            >
              <LogOut className="h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
