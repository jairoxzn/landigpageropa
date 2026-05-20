"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingBag,
  Menu,
  X,
  Heart,
  Instagram,
  Facebook
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { useCart } from "@/store/cart-store";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/catalogo?categoria=jeans", label: "Jeans" },
  { href: "/catalogo?categoria=vestidos", label: "Vestidos" },
  { href: "/nueva-coleccion", label: "Nueva colección" },
  { href: "/contacto", label: "Contacto" }
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const totalItems = useCart((s) => s.totalItems());
  const openCart = useCart((s) => s.open);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* TOP BAR */}
      <div className="hidden md:block bg-black text-white text-xs">
        <div className="container-lucia flex h-9 items-center justify-between">
          <div className="flex items-center gap-4 opacity-90">
            <span>🚚 Envío gratis en compras &gt; S/ 199</span>
            <span className="opacity-50">|</span>
            <span>💖 Atención WhatsApp 24/7</span>
          </div>
          <div className="flex items-center gap-3">
            <a href={process.env.NEXT_PUBLIC_INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
              <Instagram className="h-3.5 w-3.5 hover:text-primary transition-colors" />
            </a>
            <a href={process.env.NEXT_PUBLIC_FACEBOOK_URL} target="_blank" rel="noopener noreferrer">
              <Facebook className="h-3.5 w-3.5 hover:text-primary transition-colors" />
            </a>
          </div>
        </div>
      </div>

      {/* NAVBAR */}
      <header
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-500",
          scrolled
            ? "bg-white/85 dark:bg-black/85 backdrop-blur-xl shadow-[0_4px_30px_-10px_rgba(0,0,0,0.08)] border-b border-border/60"
            : "bg-transparent"
        )}
      >
        <div className="container-lucia flex h-16 md:h-20 items-center justify-between gap-4">
          {/* Mobile menu */}
          <button
            className="md:hidden p-2 -ml-2"
            onClick={() => setMobileOpen(true)}
            aria-label="Abrir menú"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="relative">
              <span className="block h-9 w-9 rounded-full bg-gradient-to-br from-primary to-pink-400 shadow-soft group-hover:scale-110 transition-transform" />
              <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">
                L
              </span>
            </span>
            <span className="font-display text-xl md:text-2xl font-bold tracking-tight">
              Lucia<span className="text-primary">.</span>Jeans
            </span>
          </Link>

          {/* Desktop links */}
          <nav className="hidden md:flex items-center gap-7">
            {links.map((l) => {
              const active = pathname === l.href.split("?")[0];
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "link-underline text-sm font-medium transition-colors",
                    active ? "text-primary" : "text-foreground/80 hover:text-primary"
                  )}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="hidden sm:inline-flex" aria-label="Buscar">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden sm:inline-flex" aria-label="Favoritos">
              <Heart className="h-5 w-5" />
            </Button>
            <ThemeToggle />
            <button
              onClick={openCart}
              className="relative h-10 w-10 grid place-items-center rounded-full hover:bg-accent transition-colors"
              aria-label="Carrito"
            >
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-5 min-w-5 grid place-items-center rounded-full bg-primary text-white text-[10px] font-bold px-1">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 240 }}
              className="fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] bg-background border-r border-border md:hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-5 border-b">
                <span className="font-display text-xl font-bold">
                  Lucia<span className="text-primary">.</span>Jeans
                </span>
                <button onClick={() => setMobileOpen(false)} aria-label="Cerrar menú">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex-1 p-5 space-y-1">
                {links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-3 rounded-xl text-base font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>
              <div className="p-5 border-t">
                <p className="text-xs text-muted-foreground mb-3">Síguenos</p>
                <div className="flex gap-3">
                  <a href={process.env.NEXT_PUBLIC_INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="h-10 w-10 grid place-items-center rounded-full bg-accent">
                    <Instagram className="h-4 w-4 text-primary" />
                  </a>
                  <a href={process.env.NEXT_PUBLIC_FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="h-10 w-10 grid place-items-center rounded-full bg-accent">
                    <Facebook className="h-4 w-4 text-primary" />
                  </a>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
