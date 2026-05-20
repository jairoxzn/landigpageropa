"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Lock, Mail, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function AdminLoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.get("email"),
          password: data.get("password")
        })
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error || "Error al iniciar sesión");
        return;
      }
      toast.success(`Bienvenida, ${json.user.name} 💖`);
      router.push(params.get("from") || "/admin");
      router.refresh();
    } catch {
      toast.error("Error de red");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Brand panel */}
      <aside className="hidden lg:flex flex-col justify-between p-10 bg-gradient-to-br from-primary via-pink-500 to-pink-400 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grain opacity-30" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-12">
            <span className="block h-10 w-10 rounded-full bg-white text-primary grid place-items-center font-bold">L</span>
            <span className="font-display text-2xl font-bold">Lucia.Jeans</span>
          </div>
          <h1 className="font-display text-4xl font-bold leading-tight mb-4 text-balance">
            Tu boutique, organizada como nunca antes.
          </h1>
          <p className="text-white/90 max-w-md">
            Gestiona productos, pedidos, clientes y promociones desde un panel
            premium pensado para vender más.
          </p>
        </div>
        <p className="relative text-xs opacity-80">
          © {new Date().getFullYear()} Lucia Jeans Admin
        </p>
      </aside>

      {/* Form */}
      <main className="flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <span className="block h-9 w-9 rounded-full bg-primary text-white grid place-items-center font-bold">L</span>
            <span className="font-display text-xl font-bold">Lucia.Jeans</span>
          </div>

          <h2 className="font-display text-3xl font-bold mb-2">Bienvenida</h2>
          <p className="text-muted-foreground mb-8">
            Inicia sesión para administrar tu tienda.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email">Correo</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="admin@luciajeans.com"
                  className="pl-10"
                  defaultValue="admin@luciajeans.com"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="pl-10"
                />
              </div>
            </div>
            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Iniciar sesión
            </Button>
          </form>

          <p className="text-xs text-muted-foreground mt-8 text-center">
            ¿Olvidaste tu contraseña? Contáctanos por WhatsApp.
          </p>
        </div>
      </main>
    </div>
  );
}
