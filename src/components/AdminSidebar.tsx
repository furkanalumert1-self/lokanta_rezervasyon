"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CalendarDays, UtensilsCrossed, TableIcon, Settings, LogOut, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/rezervasyonlar", label: "Rezervasyonlar", icon: CalendarDays },
  { href: "/admin/menu", label: "Menü Yönetimi", icon: UtensilsCrossed },
  { href: "/admin/masalar", label: "Masalar & QR", icon: TableIcon },
  { href: "/admin/ayarlar", label: "Ayarlar", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="px-6 py-5 border-b border-gray-700">
        <Link href="/admin" className="text-white font-bold text-lg flex items-center gap-2">
          <UtensilsCrossed className="h-5 w-5 text-orange-400" />
          <span>Cafe Merhaba</span>
        </Link>
        <p className="text-gray-400 text-xs mt-1">Admin Paneli</p>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-orange-600 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-3 py-4 border-t border-gray-700">
        <form action="/api/auth/logout" method="POST">
          <button
            type="submit"
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Çıkış Yap
          </button>
        </form>
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-xs text-gray-500 hover:text-gray-300 transition-colors mt-1"
        >
          ↗ Siteyi Görüntüle
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 bg-gray-900 flex-col min-h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-gray-900 px-4 py-3 flex items-center justify-between border-b border-gray-700">
        <Link href="/admin" className="text-white font-bold flex items-center gap-2">
          <UtensilsCrossed className="h-5 w-5 text-orange-400" />
          <span>Admin</span>
        </Link>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-gray-300 hover:text-white">
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-gray-900 flex flex-col">
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
}
