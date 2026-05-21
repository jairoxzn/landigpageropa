"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, ShoppingCart, AlertTriangle, Check } from "lucide-react";
import { useNotifications } from "./notifications-context";
import { cn, formatPrice, formatDate } from "@/lib/utils";

export function NotificationsBell() {
  const { counts, recent, loading, refresh } = useNotifications();
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const total = counts.total;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => {
          setOpen((v) => !v);
          if (!open) refresh();
        }}
        aria-label="Notificaciones"
        className="relative h-10 w-10 grid place-items-center rounded-full hover:bg-accent transition-colors"
      >
        <Bell className="h-5 w-5" />
        {total > 0 && (
          <span className="absolute top-1 right-1 h-4 min-w-4 px-1 grid place-items-center rounded-full bg-primary text-white text-[10px] font-bold animate-pulse">
            {total}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-border bg-popover shadow-card overflow-hidden z-50"
          >
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="font-display font-semibold">Notificaciones</h3>
                <p className="text-xs text-muted-foreground">
                  {total === 0 ? "Todo al día" : `${total} pendientes`}
                </p>
              </div>
              <button
                onClick={refresh}
                className="text-xs text-primary hover:underline"
                aria-label="Actualizar"
              >
                Actualizar
              </button>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-2 gap-2 p-3">
              <SummaryCard
                href="/admin/pedidos"
                onClick={() => setOpen(false)}
                icon={ShoppingCart}
                label="Pedidos pendientes"
                count={counts.pendingOrders}
                accent="primary"
              />
              <SummaryCard
                href="/admin/inventario"
                onClick={() => setOpen(false)}
                icon={AlertTriangle}
                label="Stock bajo"
                count={counts.lowStock}
                accent="amber"
              />
            </div>

            {/* Recent pending orders */}
            <div className="max-h-64 overflow-y-auto scrollbar-pretty">
              {loading ? (
                <p className="p-6 text-center text-xs text-muted-foreground">
                  Cargando…
                </p>
              ) : recent.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  <Check className="h-8 w-8 mx-auto mb-2 text-emerald-500" />
                  No hay pedidos pendientes 💖
                </div>
              ) : (
                <>
                  <p className="px-4 pt-3 pb-2 text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                    Últimos pendientes
                  </p>
                  {recent.map((o) => (
                    <Link
                      key={o.id}
                      href={`/admin/pedidos/${o.id}`}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-muted/50 border-t border-border first:border-t-0"
                    >
                      <div className="min-w-0">
                        <p className="font-mono text-xs">{o.number}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {o.customer} · {formatDate(o.createdAt)}
                        </p>
                      </div>
                      <span className="text-sm font-semibold whitespace-nowrap">
                        {formatPrice(o.total)}
                      </span>
                    </Link>
                  ))}
                </>
              )}
            </div>

            <div className="border-t border-border p-3 bg-muted/30">
              <Link
                href="/admin/pedidos"
                onClick={() => setOpen(false)}
                className="block text-center text-xs font-medium text-primary hover:underline"
              >
                Ver todos los pedidos →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SummaryCard({
  href,
  onClick,
  icon: Icon,
  label,
  count,
  accent
}: {
  href: string;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  count: number;
  accent: "primary" | "amber";
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "rounded-xl p-3 border transition-all hover:scale-[1.02]",
        count > 0
          ? accent === "primary"
            ? "bg-primary/10 border-primary/20"
            : "bg-amber-100/60 border-amber-200"
          : "bg-muted/40 border-transparent"
      )}
    >
      <div className="flex items-center gap-2 mb-1">
        <Icon
          className={cn(
            "h-4 w-4",
            count > 0
              ? accent === "primary"
                ? "text-primary"
                : "text-amber-600"
              : "text-muted-foreground"
          )}
        />
        <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
          {label}
        </span>
      </div>
      <p
        className={cn(
          "font-display text-2xl font-bold",
          count > 0
            ? accent === "primary"
              ? "text-primary"
              : "text-amber-700"
            : "text-foreground/60"
        )}
      >
        {count}
      </p>
    </Link>
  );
}
