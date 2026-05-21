"use client";

import * as React from "react";

interface RecentOrder {
  id: string;
  number: string;
  customer: string;
  total: number;
  createdAt: string;
}

interface NotificationsData {
  counts: { pendingOrders: number; lowStock: number; total: number };
  recent: RecentOrder[];
  loading: boolean;
  refresh: () => Promise<void>;
}

const NotificationsContext = React.createContext<NotificationsData | null>(null);

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [counts, setCounts] = React.useState({ pendingOrders: 0, lowStock: 0, total: 0 });
  const [recent, setRecent] = React.useState<RecentOrder[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchData = React.useCallback(async () => {
    try {
      const res = await fetch("/api/admin/notifications", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      setCounts(data.counts);
      setRecent(data.recent);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchData();
    // poll every 45 seconds
    const i = setInterval(fetchData, 45_000);
    // refresh on tab focus
    const onFocus = () => fetchData();
    window.addEventListener("focus", onFocus);
    return () => {
      clearInterval(i);
      window.removeEventListener("focus", onFocus);
    };
  }, [fetchData]);

  return (
    <NotificationsContext.Provider value={{ counts, recent, loading, refresh: fetchData }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = React.useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotifications must be used inside NotificationsProvider");
  return ctx;
}
