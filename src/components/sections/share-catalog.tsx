"use client";

import { motion } from "framer-motion";
import { Instagram, Facebook, Share2 } from "lucide-react";
import { WhatsappIcon } from "@/components/common/whatsapp-icon";
import { Button } from "@/components/ui/button";
import { whatsappCatalogShare } from "@/lib/whatsapp";

export function ShareCatalog() {
  return (
    <section className="section">
      <div className="container-lucia">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-black text-white p-10 md:p-16 text-center shadow-card"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-pink-400/20" />
          <div className="absolute -top-32 -left-20 h-80 w-80 rounded-full bg-primary/30 blur-3xl" />
          <div className="absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-pink-500/20 blur-3xl" />

          <div className="relative">
            <Share2 className="h-10 w-10 mx-auto mb-4 text-primary" />
            <h2 className="heading-lg mb-4 text-balance">
              Comparte el catálogo con tus amigas
            </h2>
            <p className="text-white/80 max-w-xl mx-auto mb-8">
              Envía nuestro catálogo por WhatsApp, Instagram o Facebook en un solo clic.
              Más estilo, menos esfuerzo.
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild variant="whatsapp" size="lg">
                <a href={whatsappCatalogShare()} target="_blank" rel="noopener noreferrer">
                  <WhatsappIcon size={16} /> WhatsApp
                </a>
              </Button>
              <Button asChild variant="default" size="lg">
                <a href={process.env.NEXT_PUBLIC_INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                  <Instagram className="h-4 w-4" /> Instagram
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
                <a href={process.env.NEXT_PUBLIC_FACEBOOK_URL} target="_blank" rel="noopener noreferrer">
                  <Facebook className="h-4 w-4" /> Facebook
                </a>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
