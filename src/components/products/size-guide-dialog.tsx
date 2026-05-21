"use client";

import * as React from "react";
import { Ruler, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type TabKey = "jeans" | "tops" | "vestidos";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TABS: { key: TabKey; label: string }[] = [
  { key: "jeans", label: "Jeans" },
  { key: "tops", label: "Blusas y tops" },
  { key: "vestidos", label: "Vestidos" }
];

const jeansData = [
  { size: "26", waist: "65 cm", hip: "88 cm", us: "0" },
  { size: "28", waist: "70 cm", hip: "93 cm", us: "2" },
  { size: "30", waist: "75 cm", hip: "98 cm", us: "4-6" },
  { size: "32", waist: "80 cm", hip: "103 cm", us: "8" },
  { size: "34", waist: "85 cm", hip: "108 cm", us: "10" },
  { size: "36", waist: "90 cm", hip: "113 cm", us: "12" }
];

const topsData = [
  { size: "XS", bust: "82 cm", waist: "62 cm" },
  { size: "S", bust: "86 cm", waist: "66 cm" },
  { size: "M", bust: "90 cm", waist: "70 cm" },
  { size: "L", bust: "96 cm", waist: "76 cm" },
  { size: "XL", bust: "102 cm", waist: "82 cm" }
];

const dressesData = [
  { size: "XS", bust: "82 cm", waist: "62 cm", hip: "88 cm" },
  { size: "S", bust: "86 cm", waist: "66 cm", hip: "92 cm" },
  { size: "M", bust: "90 cm", waist: "70 cm", hip: "96 cm" },
  { size: "L", bust: "96 cm", waist: "76 cm", hip: "102 cm" },
  { size: "XL", bust: "102 cm", waist: "82 cm", hip: "108 cm" }
];

export function SizeGuideDialog({ open, onOpenChange }: Props) {
  const [tab, setTab] = React.useState<TabKey>("jeans");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="h-10 w-10 grid place-items-center rounded-2xl bg-primary/10 text-primary">
              <Ruler className="h-5 w-5" />
            </span>
            <div>
              <DialogTitle>Guía de tallas</DialogTitle>
              <DialogDescription>
                Encuentra tu talla perfecta — medidas en centímetros.
              </DialogDescription>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-6 mb-5 p-1 bg-muted rounded-full w-fit">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium transition-all",
                  tab === t.key
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Tables */}
          {tab === "jeans" && (
            <SizeTable
              headers={["Talla LJ", "Cintura", "Cadera", "US"]}
              rows={jeansData.map((r) => [r.size, r.waist, r.hip, r.us])}
            />
          )}
          {tab === "tops" && (
            <SizeTable
              headers={["Talla", "Busto", "Cintura"]}
              rows={topsData.map((r) => [r.size, r.bust, r.waist])}
            />
          )}
          {tab === "vestidos" && (
            <SizeTable
              headers={["Talla", "Busto", "Cintura", "Cadera"]}
              rows={dressesData.map((r) => [r.size, r.bust, r.waist, r.hip])}
            />
          )}

          {/* Tips */}
          <div className="mt-6 rounded-2xl bg-accent/50 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-primary" />
              <h4 className="font-display font-semibold">Cómo tomar tus medidas</h4>
            </div>
            <ul className="space-y-2 text-sm text-foreground/80">
              <li>
                <strong>Busto:</strong> rodea la parte más prominente del busto
                manteniendo la cinta horizontal.
              </li>
              <li>
                <strong>Cintura:</strong> mide la parte más estrecha del torso,
                generalmente sobre el ombligo.
              </li>
              <li>
                <strong>Cadera:</strong> rodea la parte más amplia de la cadera con
                los pies juntos.
              </li>
            </ul>
            <p className="text-xs text-muted-foreground mt-3">
              ¿Estás entre dos tallas? Te recomendamos elegir la mayor para mayor
              comodidad. Si tienes dudas, escríbenos por WhatsApp 💖.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SizeTable({
  headers,
  rows
}: {
  headers: string[];
  rows: (string | number)[][];
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border">
      <table className="w-full text-sm">
        <thead className="bg-muted/60">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-4 py-3 text-left font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-accent/40 transition-colors">
              {row.map((cell, j) => (
                <td
                  key={j}
                  className={cn(
                    "px-4 py-3",
                    j === 0 && "font-display font-bold text-primary"
                  )}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
