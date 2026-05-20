"use client";

import { motion } from "framer-motion";
import { Truck, ShieldCheck, RotateCcw, CreditCard } from "lucide-react";

const items = [
  { icon: Truck, title: "Envío express", desc: "A todo el país en 24-72h." },
  { icon: ShieldCheck, title: "Calidad premium", desc: "Telas seleccionadas a mano." },
  { icon: RotateCcw, title: "Cambios fáciles", desc: "7 días para cambios gratis." },
  { icon: CreditCard, title: "Pago seguro", desc: "Tarjeta, Yape, transferencia." }
];

export function Benefits() {
  return (
    <section className="border-y border-border bg-card/50">
      <div className="container-lucia grid grid-cols-2 md:grid-cols-4 gap-6 py-10">
        {items.map((b, i) => (
          <motion.div
            key={b.title}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: i * 0.05 }}
            className="flex items-center gap-3"
          >
            <div className="h-11 w-11 rounded-2xl bg-primary/10 grid place-items-center text-primary shrink-0">
              <b.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold leading-tight">{b.title}</p>
              <p className="text-xs text-muted-foreground">{b.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
