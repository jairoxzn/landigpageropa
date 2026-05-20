"use client";

import { Bell, Search, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/common/theme-toggle";

export function AdminTopbar({ title }: { title?: string }) {
  return (
    <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="flex items-center justify-between gap-4 h-16 px-6">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Admin</p>
          {title && <h1 className="font-display text-lg font-semibold">{title}</h1>}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative hidden md:block w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar…" className="pl-9 h-10 rounded-full" />
          </div>
          <Button variant="ghost" size="icon" aria-label="Notificaciones">
            <Bell className="h-5 w-5" />
          </Button>
          <ThemeToggle />
          <Button asChild variant="outline" size="sm" className="hidden md:inline-flex">
            <Link href="/" target="_blank">
              <ExternalLink className="h-4 w-4" /> Ver tienda
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
