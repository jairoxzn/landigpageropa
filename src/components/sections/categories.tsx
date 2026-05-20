"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  description?: string | null;
}

export function Categories({ items }: { items: CategoryItem[] }) {
  return (
    <section className="section">
      <div className="container-lucia">
        <div className="flex items-end justify-between mb-10 gap-6">
          <div>
            <span className="eyebrow mb-3">Explora por categoría</span>
            <h2 className="heading-lg">Tu estilo, tu sello.</h2>
          </div>
          <Link
            href="/catalogo"
            className="hidden md:inline-flex items-center gap-2 text-sm font-medium link-underline"
          >
            Ver todo <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {items.slice(0, 4).map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group"
            >
              <Link
                href={`/catalogo?categoria=${c.slug}`}
                className="block relative aspect-[3/4] overflow-hidden rounded-3xl shadow-card"
              >
                {c.imageUrl ? (
                  <Image
                    src={c.imageUrl}
                    alt={c.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute inset-0 p-5 flex flex-col justify-end text-white">
                  <h3 className="font-display text-xl md:text-2xl font-bold leading-tight">
                    {c.name}
                  </h3>
                  <span className="inline-flex items-center gap-1 mt-1 text-xs font-medium opacity-90 group-hover:opacity-100 transition-opacity">
                    Descubrir
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
