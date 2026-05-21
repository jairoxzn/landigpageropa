"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  id: string;
  productName: string;
  productImage: string;
  size: string;
  color: string | null;
  stock: number;
  lowStockAt: number;
}

export function InventoryRow({
  id,
  productName,
  productImage,
  size,
  color,
  stock,
  lowStockAt
}: Props) {
  const router = useRouter();
  const [val, setVal] = React.useState(stock);
  const [loading, setLoading] = React.useState(false);
  const dirty = val !== stock;

  const save = async () => {
    if (!dirty) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/inventory/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: val })
      });
      if (!res.ok) {
        const j = await res.json();
        return toast.error(j.error || "Error");
      }
      toast.success("Stock actualizado");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const status =
    val === 0 ? "agotado" : val <= lowStockAt ? "bajo" : "ok";

  return (
    <tr className="hover:bg-muted/30">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 rounded-xl overflow-hidden bg-accent">
            <Image src={productImage} alt={productName} fill sizes="40px" className="object-cover" />
          </div>
          <span className="font-medium">{productName}</span>
        </div>
      </td>
      <td className="px-4 py-3">{size}</td>
      <td className="px-4 py-3">{color || "—"}</td>
      <td className="px-4 py-3">
        <Input
          type="number"
          min={0}
          value={val}
          onChange={(e) => setVal(Number(e.target.value))}
          onKeyDown={(e) => e.key === "Enter" && save()}
          className="w-24 h-9"
        />
      </td>
      <td className="px-4 py-3">
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
            status === "agotado"
              ? "bg-red-100 text-red-700"
              : status === "bajo"
              ? "bg-amber-100 text-amber-700"
              : "bg-emerald-100 text-emerald-700"
          )}
        >
          {status === "agotado" ? "Agotado" : status === "bajo" ? "Stock bajo" : "Disponible"}
        </span>
      </td>
      <td className="px-4 py-3 text-right">
        <Button
          size="sm"
          variant={dirty ? "default" : "ghost"}
          disabled={!dirty || loading}
          onClick={save}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
          Guardar
        </Button>
      </td>
    </tr>
  );
}
