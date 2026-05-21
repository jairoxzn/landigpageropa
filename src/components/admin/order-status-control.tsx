"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

type Status =
  | "PENDING"
  | "CONFIRMED"
  | "PAID"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

interface Props {
  orderId: string;
  status: Status;
  trackingCode?: string | null;
  notes?: string | null;
}

export function OrderStatusControl({ orderId, status, trackingCode, notes }: Props) {
  const router = useRouter();
  const [s, setS] = React.useState<Status>(status);
  const [tracking, setTracking] = React.useState(trackingCode || "");
  const [n, setN] = React.useState(notes || "");
  const [loading, setLoading] = React.useState(false);

  const save = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: s, trackingCode: tracking || null, notes: n || null })
      });
      const json = await res.json();
      if (!res.ok) return toast.error(json.error || "No se pudo actualizar");
      toast.success("Pedido actualizado");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-4">
      <h3 className="font-display text-lg font-semibold">Estado del pedido</h3>
      <div className="space-y-1.5">
        <Label>Estado</Label>
        <Select value={s} onValueChange={(v) => setS(v as Status)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="PENDING">Pendiente</SelectItem>
            <SelectItem value="CONFIRMED">Confirmado</SelectItem>
            <SelectItem value="PAID">Pagado</SelectItem>
            <SelectItem value="SHIPPED">Enviado</SelectItem>
            <SelectItem value="DELIVERED">Entregado</SelectItem>
            <SelectItem value="CANCELLED">Cancelado</SelectItem>
            <SelectItem value="REFUNDED">Reembolsado</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label>Código de seguimiento</Label>
        <Input
          placeholder="Ej. SHALOM-12345"
          value={tracking}
          onChange={(e) => setTracking(e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label>Notas internas</Label>
        <Textarea rows={3} value={n} onChange={(e) => setN(e.target.value)} />
      </div>
      <Button onClick={save} disabled={loading} className="w-full">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        Guardar cambios
      </Button>
    </div>
  );
}
