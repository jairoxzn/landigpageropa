"use client";

import { motion } from "framer-motion";
import { whatsappGenericInquiry } from "@/lib/whatsapp";
import { WhatsappIcon } from "./whatsapp-icon";

export function WhatsappFab() {
  return (
    <motion.a
      href={whatsappGenericInquiry()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chatear por WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="group fixed bottom-6 right-6 z-50 flex items-center gap-2 pr-2"
    >
      {/* Pulse */}
      <span className="absolute right-2 bottom-0 h-14 w-14 rounded-full bg-[#25D366] opacity-30 animate-ping" />

      {/* Label expandible al hover (solo desktop) */}
      <span className="hidden md:inline-flex relative items-center gap-1 px-4 py-2 rounded-full bg-white dark:bg-card text-foreground text-sm font-medium shadow-card opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
        Chatea con nosotras
        <svg className="h-3 w-3 text-primary" viewBox="0 0 20 20" fill="currentColor">
          <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
        </svg>
      </span>

      {/* Botón principal */}
      <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-card hover:shadow-[0_0_0_8px_rgba(37,211,102,0.18)] transition-shadow">
        <WhatsappIcon size={28} />
      </span>

      <span className="sr-only">WhatsApp</span>
    </motion.a>
  );
}
