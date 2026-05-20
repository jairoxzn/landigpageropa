"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Instagram } from "lucide-react";

const photos = [
  "photo-1490481651871-ab68de25d43d",
  "photo-1551488831-00ddcb6c6bd3",
  "photo-1483985988355-763728e1935b",
  "photo-1564257631407-4deb1f99d992",
  "photo-1566174053879-31528523f8ae",
  "photo-1539008835657-9e8e9680c956"
];

export function InstagramGallery() {
  return (
    <section className="section">
      <div className="container-lucia">
        <div className="text-center mb-10">
          <span className="eyebrow mb-3 justify-center">
            <Instagram className="h-3.5 w-3.5" /> @luciajeans
          </span>
          <h2 className="heading-lg text-balance">Síguenos en Instagram</h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            Etiquétanos en tus fotos con #LuciaStyle y aparece en nuestro feed.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {photos.map((p, i) => (
            <motion.a
              key={p}
              href={process.env.NEXT_PUBLIC_INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group relative aspect-square overflow-hidden rounded-2xl shadow-card"
            >
              <Image
                src={`https://images.unsplash.com/${p}?auto=format&fit=crop&w=400&q=70`}
                alt=""
                fill
                sizes="(max-width: 768px) 50vw, 16vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <Instagram className="h-7 w-7 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
