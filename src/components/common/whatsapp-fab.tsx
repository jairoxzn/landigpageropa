"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { whatsappGenericInquiry } from "@/lib/whatsapp";

export function WhatsappFab() {
  return (
    <motion.a
      href={whatsappGenericInquiry()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chatear por WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-card hover:shadow-[0_0_0_8px_rgba(37,211,102,0.18)] transition-shadow"
    >
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-30" />
      <MessageCircle className="h-6 w-6 relative" />
      <span className="sr-only">WhatsApp</span>
    </motion.a>
  );
}
