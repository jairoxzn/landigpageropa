"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingCart,
  Users,
  Image as ImageIcon,
  Sparkles,
  Settings,
  LogOut,
  Boxes,
  MessageCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNotifications } from "./notifications-context";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, badge: null as null | "orders" | "stock" },
  { href: "/admin/productos", label: "Productos", icon: Package, badge: null },
  { href: "/admin/categorias", label: "Categorías", icon: Tags, badge: null },
  { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingCart, badge: "orders" as const },
  { href: "/admin/clientes", label: "Clientes", icon: Users, badge: null },
  { href: "/admin/inventario", label: "Inventario", icon: Boxes, badge: "stock" as const },
  { href: "/admin/promociones", label: "Promociones", icon: Sparkles, badge: null },
  { href: "/admin/banners", label: "Banners", icon: ImageIcon, badge: null },
  { href: "/admin/redes", label: "Redes sociales", icon: MessageCircle, badge: null },
  { href: "/admin/configuracion", label: "Configuración", icon: Settings, badge: null }
];

export function AdminSidebar({ user }: { user: { name: string; email: string } }) {
  const pathname = usePathname();
  const router = useRouter();
  const { counts } = useNotifications();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const badgeFor = (kind: "orders" | "stock" | null) => {
    if (kind === "orders" && counts.pendingOrders > 0) return counts.pendingOrders;
    if (kind === "stock" && counts.lowStock > 0) return counts.lowStock;
    return null;
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-30 w-64 bg-card border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="block h-9 w-9 rounded-full bg-gradient-to-br from-primary to-pink-400 grid place-items-center text-white font-bold">
            L
          </span>
          <span className="font-display text-lg font-bold">
            Lucia<span className="text-primary">.</span>Admin
          </span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-pretty p-3 space-y-1">
        {links.map((l) => {
          const active =
            pathname === l.href ||
            (l.href !== "/admin" && pathname.startsWith(l.href));
          const badge = badgeFor(l.badge);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative",
                active
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "text-foreground/80 hover:bg-accent hover:text-foreground"
              )}
            >
              <l.icon className="h-4 w-4" />
              <span className="flex-1">{l.label}</span>
              {badge !== null && (
                <span
                  className={cn(
                    "h-5 min-w-5 px-1.5 grid place-items-center rounded-full text-[10px] font-bold",
                    active
                      ? "bg-white text-primary"
                      : l.badge === "orders"
                      ? "bg-primary text-white animate-pulse"
                      : "bg-amber-500 text-white"
                  )}
                >
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="h-9 w-9 rounded-full bg-primary/20 text-primary grid place-items-center font-semibold text-sm">
            {user.name.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold leading-tight truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground/80 hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
