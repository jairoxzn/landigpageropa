import { Sparkles } from "lucide-react";

const items = [
  "Envío gratis > S/199",
  "Nueva colección Otoño 2026",
  "Pago contra entrega",
  "Cambios gratis 7 días",
  "Atención WhatsApp 24/7",
  "Influencer favorite ✨"
];

export function MarqueeBar() {
  const seq = [...items, ...items];
  return (
    <div className="bg-black text-white py-3 overflow-hidden border-y border-white/10">
      <div className="marquee gap-12">
        {seq.map((t, i) => (
          <span key={i} className="flex items-center gap-3 text-sm whitespace-nowrap">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="font-medium tracking-wide uppercase">{t}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
