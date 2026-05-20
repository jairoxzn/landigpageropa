"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NewCollection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-pink-50 via-white to-pink-50 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900 py-20 md:py-28">
      <div className="absolute -top-32 -right-20 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-pink-300/30 blur-3xl" />

      <div className="container-lucia relative grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* Left media */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 gap-4"
        >
          <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-card translate-y-6">
            <Image
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80"
              alt=""
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover"
            />
          </div>
          <div className="space-y-4">
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-card">
              <Image
                src="https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=600&q=80"
                alt=""
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
            <div className="relative aspect-square rounded-3xl overflow-hidden shadow-card bg-primary text-white grid place-items-center p-6 text-center">
              <div>
                <Sparkles className="h-6 w-6 mx-auto mb-2" />
                <p className="font-display text-3xl font-bold">-40%</p>
                <p className="text-xs uppercase tracking-wider opacity-90">
                  En jeans seleccionados
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right text */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="eyebrow mb-4">Otoño 2026</span>
          <h2 className="heading-lg mb-5 text-balance">
            Nueva colección <span className="text-primary italic font-serif">«Romance»</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-6 text-pretty">
            Inspirada en la sofisticación parisina y la calidez femenina. Piezas
            atemporales con un toque romántico, diseñadas para que cada mujer brille
            a su manera.
          </p>

          <ul className="space-y-3 mb-8">
            {[
              "+60 prendas exclusivas",
              "Tela premium suave y elástica",
              "Diseños limited edition"
            ].map((t) => (
              <li key={t} className="flex items-center gap-3">
                <span className="h-6 w-6 grid place-items-center rounded-full bg-primary/10 text-primary text-xs">
                  ✓
                </span>
                <span className="text-sm">{t}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" variant="gradient">
              <Link href="/nueva-coleccion">
                Explorar colección <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/catalogo">Ver lookbook</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
