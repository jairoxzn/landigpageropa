"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-hero-gradient">
      {/* Soft floating shapes */}
      <motion.div
        className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl"
        animate={{ y: [0, 24, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 -left-10 h-60 w-60 rounded-full bg-pink-300/30 blur-3xl"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="container-lucia relative grid lg:grid-cols-2 gap-12 items-center py-16 lg:py-24">
        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          <span className="eyebrow mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            Nueva colección · Otoño 2026
          </span>
          <h1 className="heading-xl mb-6 text-balance">
            Jeans que <span className="text-primary italic font-serif">enamoran</span>,
            <br />
            estilo que te <span className="relative">define
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 200 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 9C50 3 100 3 198 9"
                  stroke="#ff4fa3"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>.
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg mb-8 text-pretty">
            Descubre los jeans, blusas y vestidos que están enamorando a miles de mujeres.
            Calidad premium, diseño femenino y envío rápido a todo el país.
          </p>

          <div className="flex flex-wrap gap-3 mb-10">
            <Button asChild size="xl" variant="gradient">
              <Link href="/catalogo">
                Comprar ahora <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="xl" variant="outline">
              <Link href="/nueva-coleccion">Ver colección</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-8">
            <div>
              <p className="text-2xl font-display font-bold">+12K</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                clientes felices
              </p>
            </div>
            <div className="h-12 w-px bg-border" />
            <div>
              <div className="flex items-center gap-1 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                4.9 / 5 reseñas
              </p>
            </div>
            <div className="h-12 w-px bg-border hidden sm:block" />
            <div className="hidden sm:block">
              <p className="text-2xl font-display font-bold text-primary">24h</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                envío express
              </p>
            </div>
          </div>
        </motion.div>

        {/* Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="relative"
        >
          <div className="relative aspect-[4/5] max-w-md mx-auto">
            {/* Halo */}
            <div className="absolute -inset-6 rounded-[3rem] bg-gradient-to-tr from-primary/30 via-pink-200/20 to-transparent blur-2xl" />

            {/* Image card */}
            <div className="relative h-full w-full rounded-[2.5rem] overflow-hidden shadow-card border border-white/40">
              <Image
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80"
                alt="Lucia Jeans · Nueva colección"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 500px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>

            {/* Floating tag — Best seller */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="absolute top-6 -left-4 md:-left-10 bg-white dark:bg-card rounded-2xl shadow-card p-3 pr-5 flex items-center gap-3"
            >
              <div className="h-10 w-10 rounded-xl bg-primary/10 grid place-items-center">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Best seller</p>
                <p className="text-sm font-semibold">Skinny Diana</p>
              </div>
            </motion.div>

            {/* Floating tag — Free shipping */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute bottom-6 -right-4 md:-right-10 bg-black text-white rounded-2xl shadow-card p-3 pr-5 flex items-center gap-3"
            >
              <span className="text-2xl">🚚</span>
              <div>
                <p className="text-[10px] uppercase tracking-wider opacity-70">Envío</p>
                <p className="text-sm font-semibold">Gratis &gt; S/199</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
