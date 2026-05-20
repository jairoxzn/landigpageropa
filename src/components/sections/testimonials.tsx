"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

export interface TestimonialItem {
  id: string;
  name: string;
  role?: string | null;
  avatarUrl?: string | null;
  rating: number;
  comment: string;
}

export function Testimonials({ items }: { items: TestimonialItem[] }) {
  return (
    <section className="section bg-accent/40">
      <div className="container-lucia">
        <div className="text-center mb-12">
          <span className="eyebrow mb-3">Lo que dicen de nosotras</span>
          <h2 className="heading-lg text-balance">
            Miles de mujeres ya viven el estilo Lucia.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {items.slice(0, 3).map((t, i) => (
            <motion.figure
              key={t.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative rounded-3xl bg-card border border-border/60 shadow-card p-8 hover:shadow-soft transition-all"
            >
              <Quote className="absolute top-6 right-6 h-10 w-10 text-primary/15" />
              <div className="flex items-center gap-1 mb-4">
                {[...Array(t.rating || 5)].map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <blockquote className="text-foreground/90 leading-relaxed mb-6 text-pretty">
                “{t.comment}”
              </blockquote>
              <figcaption className="flex items-center gap-3">
                <div className="relative h-11 w-11 rounded-full overflow-hidden bg-accent">
                  {t.avatarUrl && (
                    <Image
                      src={t.avatarUrl}
                      alt={t.name}
                      fill
                      sizes="44px"
                      className="object-cover"
                    />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-sm">{t.name}</p>
                  {t.role && <p className="text-xs text-muted-foreground">{t.role}</p>}
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
