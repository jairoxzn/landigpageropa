"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface Values {
  storeName?: string;
  tagline?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  address?: string;
  city?: string;
  country?: string;
  currency?: string;
  shippingNote?: string;
  about?: string;
}

interface Section {
  title: string;
  fields: Array<{ key: keyof Values; label: string; multiline?: boolean; placeholder?: string }>;
}

export function StoreProfileForm({
  initial,
  sections
}: {
  initial: Values;
  sections: Section[];
}) {
  const router = useRouter();
  const [form, setForm] = React.useState<Values>(initial);
  const [loading, setLoading] = React.useState(false);

  const set = <K extends keyof Values>(k: K, v: Values[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/store-profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const json = await res.json();
      if (!res.ok) return toast.error(json.error || "No se pudo guardar");
      toast.success("Configuración guardada");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6 max-w-3xl">
      {sections.map((s) => (
        <section key={s.title} className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-4">
          <h2 className="font-display text-lg font-semibold">{s.title}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {s.fields.map((f) => (
              <div
                key={String(f.key)}
                className={`space-y-1.5 ${f.multiline ? "sm:col-span-2" : ""}`}
              >
                <Label>{f.label}</Label>
                {f.multiline ? (
                  <Textarea
                    rows={4}
                    placeholder={f.placeholder}
                    value={(form[f.key] as string) || ""}
                    onChange={(e) => set(f.key, e.target.value)}
                  />
                ) : (
                  <Input
                    placeholder={f.placeholder}
                    value={(form[f.key] as string) || ""}
                    onChange={(e) => set(f.key, e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>
        </section>
      ))}

      <Button type="submit" disabled={loading} size="lg">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        Guardar cambios
      </Button>
    </form>
  );
}
